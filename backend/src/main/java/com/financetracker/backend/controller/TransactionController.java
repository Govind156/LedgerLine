package com.financetracker.backend.controller;

import com.financetracker.backend.dto.PagedResponse;
import com.financetracker.backend.dto.TransactionRequest;
import com.financetracker.backend.dto.TransactionResponse;
import com.financetracker.backend.security.CurrentUserProvider;
import com.financetracker.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor

public class TransactionController {

    private final TransactionService transactionService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        Long userId = currentUserProvider.getCurrentUserId();
        TransactionResponse created = transactionService.createTransaction(userId, currentUserProvider.getCurrentUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<TransactionResponse>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(transactionService.getTransactions(userId, page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        Long userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(transactionService.updateTransaction(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        Long userId = currentUserProvider.getCurrentUserId();
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.noContent().build();
    }
}
