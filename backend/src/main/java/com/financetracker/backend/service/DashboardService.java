package com.financetracker.backend.service;

import com.financetracker.backend.dto.BudgetResponse;
import com.financetracker.backend.dto.CategorySpendResponse;
import com.financetracker.backend.dto.DashboardSummaryResponse;
import com.financetracker.backend.dto.MonthlyTrendResponse;
import com.financetracker.backend.repository.BudgetRepository;
import com.financetracker.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetService budgetService;

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(Long userId, Integer month, Integer year) {
        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();

        YearMonth ym = YearMonth.of(y, m);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal totalIncome = transactionRepository.sumIncomeBetween(userId, start, end);
        BigDecimal totalExpense = transactionRepository.sumExpenseBetween(userId, start, end);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        List<CategorySpendResponse> expensesByCategory = transactionRepository
                .sumExpensesByCategoryBetween(userId, start, end).stream()
                .map(row -> CategorySpendResponse.builder()
                        .categoryId((Long) row[0])
                        .categoryName((String) row[1])
                        .categoryColor((String) row[2])
                        .totalAmount((BigDecimal) row[3])
                        .build())
                .toList();

        List<MonthlyTrendResponse> monthlyTrend = buildMonthlyTrend(userId, ym);

        List<BudgetResponse> budgetAlerts = budgetRepository.findByUserIdAndMonthAndYear(userId, m, y).stream()
                .map(b -> budgetService.toResponse(userId, b))
                .filter(b -> b.isExceeded() || b.isNearLimit())
                .toList();

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(totalIncome.subtract(totalExpense))
                .expensesByCategory(expensesByCategory)
                .monthlyTrend(monthlyTrend)
                .budgetAlerts(budgetAlerts)
                .build();
    }

    /**
     * Builds a 6-month trend (5 previous months + current) for income vs. expense,
     * used to power the trend line chart on the dashboard.
     */
    private List<MonthlyTrendResponse> buildMonthlyTrend(Long userId, YearMonth current) {
        List<MonthlyTrendResponse> trend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = current.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal income = transactionRepository.sumIncomeBetween(userId, start, end);
            BigDecimal expense = transactionRepository.sumExpenseBetween(userId, start, end);

            trend.add(MonthlyTrendResponse.builder()
                    .month(ym.format(MONTH_FORMAT))
                    .income(income != null ? income : BigDecimal.ZERO)
                    .expense(expense != null ? expense : BigDecimal.ZERO)
                    .build());
        }
        return trend;
    }
}