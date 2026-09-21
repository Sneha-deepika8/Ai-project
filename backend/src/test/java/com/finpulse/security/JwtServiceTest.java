package com.finpulse.security;

import com.finpulse.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFullName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("encoded-password");
        user.setRole(User.Role.USER);
    }

    @Test
    void generatesAndValidatesToken() {
        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertEquals("test@example.com", jwtService.extractEmail(token));
        assertEquals(1L, jwtService.extractUserId(token));
        assertEquals("USER", jwtService.extractRole(token));
        assertTrue(jwtService.isTokenValid(token, "test@example.com"));
    }

    @Test
    void rejectsTokenForWrongEmail() {
        String token = jwtService.generateToken(user);
        assertFalse(jwtService.isTokenValid(token, "someone-else@example.com"));
    }
}