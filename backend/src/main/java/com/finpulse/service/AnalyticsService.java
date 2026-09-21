package com.finpulse.service;

import com.finpulse.dto.DashboardResponse;
import com.finpulse.dto.GoalResponse;
import com.finpulse.dto.TransactionResponse;
import com.finpulse.entity.Transaction;
import com.finpulse.entity.User;
import com.finpulse.repository.GoalRepository;
import com.finpulse.repository.TransactionRepository;
import com.finpulse.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;
    private final SecurityUtils securityUtils;
    private final GoalService goalService;

    public AnalyticsService(TransactionRepository transactionRepository,
                             GoalRepository goalRepository,
                             SecurityUtils securityUtils,
                             GoalService goalService) {
        this.transactionRepository = transactionRepository;
        this.goalRepository = goalRepository;
        this.securityUtils = securityUtils;
        this.goalService = goalService;
    }

    public DashboardResponse getDashboard() {
        User user = securityUtils.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);

        DashboardResponse response = buildAnalytics(transactions);

        response.setRecentTransactions(transactions.stream()
                .limit(10)
                .map(TransactionResponse::fromEntity)
                .toList());

        List<GoalResponse> goals = goalRepository.findByUserOrderByTargetDateAsc(user).stream()
                .map(goalService::toResponse)
                .toList();
        response.setGoals(goals);

        return response;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        User user = securityUtils.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);
        return calculateCategoryBreakdown(transactions);
    }

    public DashboardResponse getMonthlyAnalytics() {
        User user = securityUtils.getCurrentUser();
        LocalDate start = LocalDate.now().withDayOfMonth(1);
        LocalDate end = LocalDate.now();
        List<Transaction> transactions = transactionRepository.findByUserAndTransactionDateBetween(user, start, end);
        return buildAnalytics(transactions);
    }

    public DashboardResponse getSummary() {
        User user = securityUtils.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);
        return buildAnalytics(transactions);
    }

    private DashboardResponse buildAnalytics(List<Transaction> transactions) {
        DashboardResponse response = new DashboardResponse();

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, BigDecimal> categoryBreakdown = calculateCategoryBreakdown(transactions);

        String highest = categoryBreakdown.entrySet().stream()
                .max(Comparator.comparing(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse(null);

        String lowest = categoryBreakdown.entrySet().stream()
                .min(Comparator.comparing(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse(null);

        List<Transaction> expenseTransactions = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .toList();

        BigDecimal avgDaily = BigDecimal.ZERO;
        BigDecimal avgMonthly = BigDecimal.ZERO;
        if (!expenseTransactions.isEmpty()) {
            LocalDate earliest = expenseTransactions.stream()
                    .map(Transaction::getTransactionDate)
                    .min(LocalDate::compareTo)
                    .orElse(LocalDate.now());
            LocalDate latest = expenseTransactions.stream()
                    .map(Transaction::getTransactionDate)
                    .max(LocalDate::compareTo)
                    .orElse(LocalDate.now());

            long days = Math.max(1, ChronoUnit.DAYS.between(earliest, latest) + 1);
            long months = Math.max(1, Math.round(days / 30.0));

            avgDaily = totalExpense.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);
            avgMonthly = totalExpense.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);
        }

        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);
        response.setHighestSpendingCategory(highest);
        response.setLowestSpendingCategory(lowest);
        response.setAverageDailySpending(avgDaily);
        response.setAverageMonthlySpending(avgMonthly);
        response.setTransactionCount(transactions.size());
        response.setCategoryBreakdown(categoryBreakdown);

        return response;
    }

    private Map<String, BigDecimal> calculateCategoryBreakdown(List<Transaction> transactions) {
        Map<String, BigDecimal> breakdown = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().name(),
                        LinkedHashMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));
        return breakdown;
    }
}