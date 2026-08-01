# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifest files
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy project source code
COPY . .

# Build static production assets
RUN npm run build

# Production server stage
FROM nginx:alpine

# Copy Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from build stage to Nginx server root
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
