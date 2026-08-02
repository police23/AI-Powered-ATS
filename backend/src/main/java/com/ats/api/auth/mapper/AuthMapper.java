package com.ats.api.auth.mapper;

import com.ats.api.auth.dto.response.RegisterResponse;
import com.ats.api.auth.dto.response.UserSummaryResponse;
import com.ats.api.auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public RegisterResponse toRegisterResponse(User user) {
        if (user == null) {
            return null;
        }
        return new RegisterResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }

    public UserSummaryResponse toUserSummaryResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
}
