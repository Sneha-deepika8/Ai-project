package com.finpulse.controller;

import com.finpulse.dto.AIInsightResponse;
import com.finpulse.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AIInsightResponse> analyze() {
        return ResponseEntity.ok(aiService.generateInsight());
    }
}