export interface ApiErrorResponse {
  code?: string;
  message?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  errors?: string[];
}

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: string[];

  constructor(status: number, message: string, code?: string, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

let currentAccessToken: string | null = localStorage.getItem('accessToken');
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

export const getStoredAccessToken = (): string | null => currentAccessToken;

export const setStoredAccessToken = (token: string | null) => {
  currentAccessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  skipAuth?: boolean;
}

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (!options.skipAuth && currentAccessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${currentAccessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Ensures HTTP-only refreshToken cookies are sent
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError(0, err.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  }

  // Handle 401 Unauthorized with token refresh (avoid infinite loop for auth endpoints)
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newAccessToken = data.accessToken;
          setStoredAccessToken(newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);
          
          // Retry original request
          (headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
          return request<T>(endpoint, { ...options, headers });
        } else {
          setStoredAccessToken(null);
          isRefreshing = false;
          onRefreshed(null);
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
      } catch {
        setStoredAccessToken(null);
        isRefreshing = false;
        onRefreshed(null);
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    } else {
      // Wait for ongoing refresh to complete
      return new Promise<T>((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (newToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
            resolve(request<T>(endpoint, { ...options, headers }));
          } else {
            reject(new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'UNAUTHORIZED'));
          }
        });
      });
    }
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parse failure
    }

    const message = errorData?.message || (errorData?.errors && errorData.errors.length > 0 ? errorData.errors[0] : `Yêu cầu thất bại (mã lỗi: ${response.status})`);
    throw new ApiError(response.status, message, errorData?.code, errorData?.errors);
  }

  // Check if response has body (e.g. 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T;
  }
  
  return {} as T;
}

export const httpClient = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: RequestOptions) => request<T>(url, { ...options, method: 'POST', body }),
  put: <T>(url: string, body?: any, options?: RequestOptions) => request<T>(url, { ...options, method: 'PUT', body }),
  patch: <T>(url: string, body?: any, options?: RequestOptions) => request<T>(url, { ...options, method: 'PATCH', body }),
  delete: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'DELETE' }),
};
