package com.finpulse.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private String highestSpendingCategory;
    private String lowestSpendingCategory;
    private BigDecimal averageDailySpending;
    private BigDecimal averageMonthlySpending;
    private long transactionCount;
    private Map<String, BigDecimal> categoryBreakdown;
    private List<TransactionResponse> recentTransactions;
    private List<GoalResponse> goals;

    public DashboardResponse() {
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getHighestSpendingCategory() {
        return highestSpendingCategory;
    }

    public void setHighestSpendingCategory(String highestSpendingCategory) {
        this.highestSpendingCategory = highestSpendingCategory;
    }

    public String getLowestSpendingCategory() {
        return lowestSpendingCategory;
    }

    public void setLowestSpendingCategory(String lowestSpendingCategory) {
        this.lowestSpendingCategory = lowestSpendingCategory;
    }

    public BigDecimal getAverageDailySpending() {
        return averageDailySpending;
    }

    public void setAverageDailySpending(BigDecimal averageDailySpending) {
        this.averageDailySpending = averageDailySpending;
    }

    public BigDecimal getAverageMonthlySpending() {
        return averageMonthlySpending;
    }

    public void setAverageMonthlySpending(BigDecimal averageMonthlySpending) {
        this.averageMonthlySpending = averageMonthlySpending;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public List<GoalResponse> getGoals() {
        return goals;
    }

    public void setGoals(List<GoalResponse> goals) {
        this.goals = goals;
    }
}


