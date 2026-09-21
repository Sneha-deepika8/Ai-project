package com.finpulse.controller;

import com.finpulse.repository.GoalRepository;
import com.finpulse.repository.TransactionRepository;
import com.finpulse.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;

    public AdminController(UserRepository userRepository,
                            TransactionRepository transactionRepository,
                            GoalRepository goalRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.goalRepository = goalRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalTransactions", transactionRepository.count());
        stats.put("totalGoals", goalRepository.count());
        return ResponseEntity.ok(stats);
    }
}
