package com.ats.api.auth.security;

import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
public class SecurityUserPrincipal implements UserDetails {

    private final UUID userId;
    private final String email;
    private final String password;
    private final UserRole role;
    private final AccountStatus status;
    private final Collection<? extends GrantedAuthority> authorities;

    public SecurityUserPrincipal(User user) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.password = user.getPasswordHash();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    public SecurityUserPrincipal(UUID userId, String email, UserRole role, AccountStatus status) {
        this.userId = userId;
        this.email = email;
        this.password = "";
        this.role = role;
        this.status = status;
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != AccountStatus.LOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == AccountStatus.ACTIVE;
    }
}
