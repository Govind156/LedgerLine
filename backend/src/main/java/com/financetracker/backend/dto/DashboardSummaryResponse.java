package com.financetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.financetracker.backend.dto.MonthlyTrendResponse;


import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netBalance;
    private List<CategorySpendResponse> expensesByCategory;
    private List<MonthlyTrendResponse> monthlyTrend;
    private List<BudgetResponse> budgetAlerts;
}