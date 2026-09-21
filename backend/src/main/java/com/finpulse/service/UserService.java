package com.finpulse.service;

import com.finpulse.dto.UserDTO;
import com.finpulse.entity.User;
import com.finpulse.util.SecurityUtils;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final SecurityUtils securityUtils;

    public UserService(SecurityUtils securityUtils) {
        this.securityUtils = securityUtils;
    }

    public UserDTO getCurrentUserProfile() {
        User user = securityUtils.getCurrentUser();
        return new UserDTO(user.getId(), user.getFullName(), user.getEmail(),
                user.getRole().name(), user.getCreatedAt());
    }
}