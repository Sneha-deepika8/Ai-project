package com.finpulse.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.finpulse.dto.GoalResponse;
import com.finpulse.entity.Goal;

class GoalServiceTest {

    // toResponse() only performs pure calculations and does not touch the repository
    // or the authenticated user, so the collaborators can safely be null here.
    private final GoalService goalService = new GoalService(null, null);

    @Test
    void calculatesProgressAndRequiredSavings() {
        Goal goal = new Goal();
        goal.setId(1L);
        goal.setName("Buy Laptop");
        goal.setTargetAmount(new BigDecimal("80000"));
        goal.setCurrentAmount(new BigDecimal("30000"));
        goal.setTargetDate(LocalDate.now().plusMonths(5));
        goal.setStatus(Goal.GoalStatus.ACTIVE);

        GoalResponse response = goalService.toResponse(goal);

        assertEquals(new BigDecimal("50000"), response.getRemainingAmount());
        assertEquals(37.5, response.getPercentageCompleted());
        assertTrue(response.getRequiredMonthlySaving().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(response.getRequiredDailySaving().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    void neverReturnsNegativeRemainingAmount() {
        Goal goal = new Goal();
        goal.setTargetAmount(new BigDecimal("1000"));
        goal.setCurrentAmount(new BigDecimal("1000"));
        goal.setTargetDate(LocalDate.now().plusDays(10));
        goal.setStatus(Goal.GoalStatus.COMPLETED);

        GoalResponse response = goalService.toResponse(goal);

        assertEquals(0, response.getRemainingAmount().compareTo(BigDecimal.ZERO));
        assertEquals(100.0, response.getPercentageCompleted());
    }
}