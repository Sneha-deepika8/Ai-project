package com.finpulse.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finpulse.dto.ContributeRequest;
import com.finpulse.dto.GoalRequest;
import com.finpulse.dto.GoalResponse;
import com.finpulse.entity.Goal;
import com.finpulse.entity.User;
import com.finpulse.exception.BadRequestException;
import com.finpulse.exception.ResourceNotFoundException;
import com.finpulse.repository.GoalRepository;
import com.finpulse.util.SecurityUtils;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final SecurityUtils securityUtils;

    public GoalService(GoalRepository goalRepository, SecurityUtils securityUtils) {
        this.goalRepository = goalRepository;
        this.securityUtils = securityUtils;
    }

    public GoalResponse createGoal(GoalRequest request) {
        User user = securityUtils.getCurrentUser();

        if (request.getCurrentAmount() != null &&
                request.getCurrentAmount().compareTo(request.getTargetAmount()) > 0) {
            throw new BadRequestException("Current amount cannot exceed target amount.");
        }

        Goal goal = new Goal();
        goal.setUser(user);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO);
        goal.setTargetDate(request.getTargetDate());
        goal.setDescription(request.getDescription());
        goal.setStatus(resolveStatus(goal));

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    public List<GoalResponse> getAllGoals() {
        User user = securityUtils.getCurrentUser();
        return goalRepository.findByUserOrderByTargetDateAsc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public GoalResponse getGoalById(Long id) {
        Goal goal = findOwnedGoal(id);
        return toResponse(goal);
    }

    public GoalResponse updateGoal(Long id, GoalRequest request) {
        Goal goal = findOwnedGoal(id);

        BigDecimal newCurrentAmount = request.getCurrentAmount() != null ? request.getCurrentAmount() : goal.getCurrentAmount();
        if (newCurrentAmount.compareTo(request.getTargetAmount()) > 0) {
            throw new BadRequestException("Current amount cannot exceed target amount.");
        }

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(newCurrentAmount);
        goal.setTargetDate(request.getTargetDate());
        goal.setDescription(request.getDescription());
        goal.setStatus(resolveStatus(goal));

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    public void deleteGoal(Long id) {
        Goal goal = findOwnedGoal(id);
        goalRepository.delete(goal);
    }

    public GoalResponse contribute(Long id, ContributeRequest request) {
        Goal goal = findOwnedGoal(id);

        BigDecimal newAmount = goal.getCurrentAmount().add(request.getAmount());

        // Prevent currentAmount from exceeding targetAmount
        if (newAmount.compareTo(goal.getTargetAmount()) > 0) {
            newAmount = goal.getTargetAmount();
        }

        goal.setCurrentAmount(newAmount);
        goal.setStatus(resolveStatus(goal));

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    private Goal findOwnedGoal(Long id) {
        User user = securityUtils.getCurrentUser();
        return goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found."));
    }

    private Goal.GoalStatus resolveStatus(Goal goal) {
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            return Goal.GoalStatus.COMPLETED;
        }
        if (goal.getTargetDate() != null && goal.getTargetDate().isBefore(LocalDate.now())) {
            return Goal.GoalStatus.OVERDUE;
        }
        return Goal.GoalStatus.ACTIVE;
    }

    /**
     * Maps a Goal entity to a response DTO, computing remainingAmount, percentageCompleted,
     * daysRemaining, requiredMonthlySaving and requiredDailySaving using the formulas:
     *
     * remainingAmount = targetAmount - currentAmount
     * percentageCompleted = (currentAmount / targetAmount) * 100
     * requiredMonthlySaving = remainingAmount / remainingMonths
     * requiredDailySaving = remainingAmount / remainingDays
     *
     * None of the derived values are allowed to be negative.
     */
    public GoalResponse toResponse(Goal goal) {
        GoalResponse response = new GoalResponse();
        response.setId(goal.getId());
        response.setName(goal.getName());
        response.setTargetAmount(goal.getTargetAmount());
        response.setCurrentAmount(goal.getCurrentAmount());
        response.setTargetDate(goal.getTargetDate());
        response.setDescription(goal.getDescription());
        response.setStatus(goal.getStatus().name());
        response.setCreatedAt(goal.getCreatedAt());
        response.setUpdatedAt(goal.getUpdatedAt());

        BigDecimal remainingAmount = goal.getTargetAmount().subtract(goal.getCurrentAmount());
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            remainingAmount = BigDecimal.ZERO;
        }
        response.setRemainingAmount(remainingAmount);

        double percentage = 0.0;
        if (goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            percentage = goal.getCurrentAmount()
                    .divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
        percentage = Math.min(100.0, Math.max(0.0, percentage));
        response.setPercentageCompleted(Math.round(percentage * 100.0) / 100.0);

        LocalDate today = LocalDate.now();
        long daysRemaining = 0;
        if (goal.getTargetDate() != null && goal.getTargetDate().isAfter(today)) {
            daysRemaining = ChronoUnit.DAYS.between(today, goal.getTargetDate());
        }
        response.setDaysRemaining(daysRemaining);

        long remainingMonths = 0;
        if (goal.getTargetDate() != null && goal.getTargetDate().isAfter(today)) {
            Period period = Period.between(today, goal.getTargetDate());
            remainingMonths = period.getYears() * 12L + period.getMonths();
            if (period.getDays() > 0) {
                remainingMonths += 1;
            }
        }

        BigDecimal requiredMonthlySaving = BigDecimal.ZERO;
        if (remainingMonths > 0) {
            requiredMonthlySaving = remainingAmount.divide(BigDecimal.valueOf(remainingMonths), 2, RoundingMode.HALF_UP);
        } else if (remainingAmount.compareTo(BigDecimal.ZERO) > 0) {
            requiredMonthlySaving = remainingAmount;
        }
        if (requiredMonthlySaving.compareTo(BigDecimal.ZERO) < 0) {
            requiredMonthlySaving = BigDecimal.ZERO;
        }
        response.setRequiredMonthlySaving(requiredMonthlySaving);

        BigDecimal requiredDailySaving = BigDecimal.ZERO;
        if (daysRemaining > 0) {
            requiredDailySaving = remainingAmount.divide(BigDecimal.valueOf(daysRemaining), 2, RoundingMode.HALF_UP);
        } else if (remainingAmount.compareTo(BigDecimal.ZERO) > 0) {
            requiredDailySaving = remainingAmount;
        }
        if (requiredDailySaving.compareTo(BigDecimal.ZERO) < 0) {
            requiredDailySaving = BigDecimal.ZERO;
        }
        response.setRequiredDailySaving(requiredDailySaving);

        return response;
    }
}