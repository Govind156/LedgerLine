package com.financetracker.backend.controller;

import com.financetracker.backend.dto.BudgetRequest;
import com.financetracker.backend.dto.BudgetResponse;
import com.financetracker.backend.security.CurrentUserProvider;
import com.financetracker.backend.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping
    public ResponseEntity<BudgetResponse> createOrUpdateBudget(@Valid @RequestBody BudgetRequest request) {
        Long userId = currentUserProvider.getCurrentUserId();
        BudgetResponse response = budgetService.createOrUpdateBudget(userId, currentUserProvider.getCurrentUser(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        Long userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(budgetService.getBudgets(userId, month, year));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        Long userId = currentUserProvider.getCurrentUserId();
        budgetService.deleteBudget(userId, id);
        return ResponseEntity.noContent().build();
    }
}