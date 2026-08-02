package com.ats.api.auth.dto.request;

import com.ats.api.auth.entity.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 8, message = "Mật khẩu tối thiểu 8 ký tự")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Mật khẩu phải từ 8 ký tự, chứa ít nhất 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt"
        )
        String password,

        @NotNull(message = "Vai trò không được để trống")
        UserRole role,

        String companyName
) {
}
