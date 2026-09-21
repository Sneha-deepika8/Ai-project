package com.finpulse.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

import com.finpulse.dto.AuthResponse;
import com.finpulse.dto.LoginRequest;
import com.finpulse.dto.RegisterRequest;
import com.finpulse.exception.BadRequestException;
import com.finpulse.repository.UserRepository;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    private RegisterRequest buildRegisterRequest(String email) {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Jane Doe");
        request.setEmail(email);
        request.setPassword("password123");
        request.setConfirmPassword("password123");
        return request;
    }

    @Test
    void registersUserAndHashesPassword() {
        RegisterRequest request = buildRegisterRequest("jane@example.com");

        AuthResponse response = authService.register(request);

        assertNotNull(response.getToken());
        assertEquals("jane@example.com", response.getEmail());

        var savedUser = userRepository.findByEmail("jane@example.com").orElseThrow();
        assertNotEquals("password123", savedUser.getPassword());
        assertTrue(savedUser.getPassword().startsWith("$2"));
    }

    @Test
    void rejectsMismatchedPasswords() {
        RegisterRequest request = buildRegisterRequest("mismatch@example.com");
        request.setConfirmPassword("different");

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void rejectsDuplicateEmail() {
        authService.register(buildRegisterRequest("dup@example.com"));
        assertThrows(BadRequestException.class, () -> authService.register(buildRegisterRequest("dup@example.com")));
    }

    @Test
    void loginSucceedsWithCorrectCredentials() {
        authService.register(buildRegisterRequest("login@example.com"));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@example.com");
        loginRequest.setPassword("password123");

        AuthResponse response = authService.login(loginRequest);
        assertNotNull(response.getToken());
    }

    @Test
    void loginFailsWithWrongPassword() {
        authService.register(buildRegisterRequest("wrongpass@example.com"));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrongpass@example.com");
        loginRequest.setPassword("incorrect");

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}