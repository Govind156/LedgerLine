package com.financetracker.backend.service;

import com.financetracker.backend.dto.BudgetRequest;
import com.financetracker.backend.dto.BudgetResponse;
import com.financetracker.backend.entity.Budget;
import com.financetracker.backend.entity.Category;
import com.financetracker.backend.entity.User;
import com.financetracker.backend.exception.DuplicateResourceException;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.repository.BudgetRepository;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private static final BigDecimal NEAR_LIMIT_THRESHOLD = BigDecimal.valueOf(80);

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public BudgetResponse createOrUpdateBudget(Long userId, User userRef, BudgetRequest request) {
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Budget budget = budgetRepository
                .findByUserIdAndCategoryIdAndMonthAndYear(userId, request.getCategoryId(), request.getMonth(), request.getYear())
                .orElse(null);

        if (budget == null) {
            budget = Budget.builder()
                    .user(userRef)
                    .category(category)
                    .monthlyLimit(request.getMonthlyLimit())
                    .month(request.getMonth())
                    .year(request.getYear())
                    .build();
        } else {
            budget.setMonthlyLimit(request.getMonthlyLimit());
        }

        Budget saved = budgetRepository.save(budget);
        return toResponse(userId, saved);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(Long userId, Integer month, Integer year) {
        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();
        return budgetRepository.findByUserIdAndMonthAndYear(userId, m, y).stream()
                .map(b -> toResponse(userId, b))
                .toList();
    }

    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.delete(budget);
    }

    @Transactional(readOnly = true)
    public BudgetResponse toResponse(Long userId, Budget budget) {
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal spent = transactionRepository.sumExpenseByCategoryBetween(
                userId, budget.getCategory().getId(), start, end);
        if (spent == null) spent = BigDecimal.ZERO;

        BigDecimal limit = budget.getMonthlyLimit();
        BigDecimal remaining = limit.subtract(spent);

        double percentage = limit.compareTo(BigDecimal.ZERO) > 0
                ? spent.multiply(BigDecimal.valueOf(100)).divide(limit, 2, RoundingMode.HALF_UP).doubleValue()
                : 0.0;

        boolean exceeded = spent.compareTo(limit) > 0;
        boolean nearLimit = !exceeded && BigDecimal.valueOf(percentage).compareTo(NEAR_LIMIT_THRESHOLD) >= 0;

        return BudgetResponse.builder()
                .id(budget.getId())
                .categoryId(budget.getCategory().getId())
                .categoryName(budget.getCategory().getName())
                .categoryColor(budget.getCategory().getColor())
                .monthlyLimit(limit)
                .spentAmount(spent)
                .remainingAmount(remaining)
                .percentageUsed(percentage)
                .exceeded(exceeded)
                .nearLimit(nearLimit)
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}