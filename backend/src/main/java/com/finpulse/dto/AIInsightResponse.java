package com.finpulse.dto;

import java.time.LocalDateTime;

public class AIInsightResponse {

    private String insight;
    private LocalDateTime generatedAt;
    private String disclaimer = "AI insights are educational suggestions based on the information you provide and are not professional financial advice.";

    public AIInsightResponse() {
    }

    public AIInsightResponse(String insight, LocalDateTime generatedAt) {
        this.insight = insight;
        this.generatedAt = generatedAt;
    }

    public String getInsight() {
        return insight;
    }

    public void setInsight(String insight) {
        this.insight = insight;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}