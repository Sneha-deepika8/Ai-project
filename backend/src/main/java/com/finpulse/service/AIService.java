package com.finpulse.service;

import com.finpulse.dto.AIInsightResponse;
import com.finpulse.dto.DashboardResponse;
import com.finpulse.dto.GoalResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private static final String SYSTEM_PROMPT = """
            You are a personal finance assistant embedded in an app called FinPulse AI.
            You analyze a user's financial summary and produce short, practical, encouraging insights.
            Rules you must always follow:
            - Do not provide investment, tax, legal, or guaranteed financial advice.
            - Keep recommendations educational and personalized to the numbers given.
            - Be concise: use short paragraphs or a few bullet points.
            - Always cover, in this order: highest spending area, a spending observation,
              a saving suggestion, a goal progress observation, and one practical next action.
            """;

    private final AnalyticsService analyticsService;
    private final GoalService goalService;
    private final com.finpulse.repository.GoalRepository goalRepository;
    private final com.finpulse.util.SecurityUtils securityUtils;
    private final ChatClient chatClient;

    public AIService(AnalyticsService analyticsService,
                      GoalService goalService,
                      com.finpulse.repository.GoalRepository goalRepository,
                      com.finpulse.util.SecurityUtils securityUtils,
                      ChatClient.Builder chatClientBuilder) {
        this.analyticsService = analyticsService;
        this.goalService = goalService;
        this.goalRepository = goalRepository;
        this.securityUtils = securityUtils;
        this.chatClient = chatClientBuilder.build();
    }

    public AIInsightResponse generateInsight() {
        DashboardResponse dashboard = analyticsService.getSummary();

        var user = securityUtils.getCurrentUser();
        List<GoalResponse> goals = goalRepository.findByUserOrderByTargetDateAsc(user).stream()
                .map(goalService::toResponse)
                .toList();

        GoalResponse primaryGoal = goals.stream()
                .filter(g -> "ACTIVE".equals(g.getStatus()))
                .findFirst()
                .orElse(goals.isEmpty() ? null : goals.get(0));

        String prompt = buildPrompt(dashboard, primaryGoal);

        String aiText;
        try {
            aiText = chatClient.prompt(new Prompt(List.of(
                            new SystemMessage(SYSTEM_PROMPT),
                            new UserMessage(prompt)
                    )))
                    .call()
                    .content();
        } catch (Exception ex) {
            aiText = fallbackInsight(dashboard, primaryGoal);
        }

        return new AIInsightResponse(aiText, LocalDateTime.now());
    }

    private String buildPrompt(DashboardResponse dashboard, GoalResponse goal) {
        StringBuilder sb = new StringBuilder();
        sb.append("Analyze the following user's financial information.\n\n");
        sb.append("Income: ").append(format(dashboard.getTotalIncome())).append("\n");
        sb.append("Expenses: ").append(format(dashboard.getTotalExpense())).append("\n");
        sb.append("Current balance: ").append(format(dashboard.getBalance())).append("\n");
        sb.append("Category spending: ").append(formatCategories(dashboard.getCategoryBreakdown())).append("\n");
        sb.append("Highest spending category: ").append(dashboard.getHighestSpendingCategory()).append("\n");

        if (goal != null) {
            sb.append("Goal: ").append(goal.getName())
                    .append(" (target ").append(format(goal.getTargetAmount()))
                    .append(", saved so far ").append(format(goal.getCurrentAmount())).append(")\n");
            sb.append("Goal progress: ").append(goal.getPercentageCompleted()).append("% completed, ")
                    .append(goal.getDaysRemaining()).append(" days remaining, recommended saving ")
                    .append(format(goal.getRequiredMonthlySaving())).append(" per month or ")
                    .append(format(goal.getRequiredDailySaving())).append(" per day.\n");
        } else {
            sb.append("Goal: the user has not set up any savings goal yet.\n");
        }

        sb.append("""

                Provide:
                1. Highest spending area
                2. Spending observation
                3. Saving suggestion
                4. Goal progress observation
                5. Practical next action
                """);
        return sb.toString();
    }

    private String formatCategories(Map<String, BigDecimal> categories) {
        if (categories == null || categories.isEmpty()) {
            return "No expenses recorded yet";
        }
        StringBuilder sb = new StringBuilder();
        categories.forEach((k, v) -> sb.append(k).append(": ").append(format(v)).append("; "));
        return sb.toString();
    }

    private String format(BigDecimal amount) {
        return amount == null ? "0" : amount.toPlainString();
    }

    private String fallbackInsight(DashboardResponse dashboard, GoalResponse goal) {
        StringBuilder sb = new StringBuilder();
        String highest = dashboard.getHighestSpendingCategory() != null ? dashboard.getHighestSpendingCategory() : "your spending";
        sb.append("1. Highest spending area: ").append(highest).append(" currently accounts for the largest share of your expenses.\n");
        sb.append("2. Spending observation: your total expenses are ").append(format(dashboard.getTotalExpense()))
                .append(" against an income of ").append(format(dashboard.getTotalIncome())).append(".\n");
        sb.append("3. Saving suggestion: consider trimming spending in ").append(highest)
                .append(" to free up money for savings.\n");

        if (goal != null) {
            sb.append("4. Goal progress observation: you are ").append(goal.getPercentageCompleted())
                    .append("% of the way to \"").append(goal.getName()).append("\".\n");
            sb.append("5. Practical next action: try saving about ").append(format(goal.getRequiredDailySaving()))
                    .append(" per day to stay on track.\n");
        } else {
            sb.append("4. Goal progress observation: you have not created a savings goal yet.\n");
            sb.append("5. Practical next action: set up a savings goal to get a personalized daily/monthly saving plan.\n");
        }

        sb.append("\n(This is a generated fallback insight because the AI service was unavailable. ");
        sb.append("This is educational information, not professional financial advice.)");
        return sb.toString();
    }
}