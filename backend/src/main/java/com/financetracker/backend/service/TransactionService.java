package com.financetracker.backend.service;

import com.financetracker.backend.dto.PagedResponse;
import com.financetracker.backend.dto.TransactionRequest;
import com.financetracker.backend.dto.TransactionResponse;
import com.financetracker.backend.entity.Category;
import com.financetracker.backend.entity.Transaction;
import com.financetracker.backend.entity.User;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TransactionResponse createTransaction(Long userId, User userRef, TransactionRequest request) {
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Transaction transaction = Transaction.builder()
                .user(userRef)
                .category(category)
                .type(request.getType())
                .amount(request.getAmount())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .build();

        return toDto(transactionRepository.save(transaction));
    }

    @Transactional(readOnly = true)
    public PagedResponse<TransactionResponse> getTransactions(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<Transaction> result = transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId, pageable);

        return PagedResponse.<TransactionResponse>builder()
                .content(result.getContent().stream().map(this::toDto).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    @Transactional
    public TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        transaction.setCategory(category);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        return toDto(transactionRepository.save(transaction));
    }

    @Transactional
    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    private TransactionResponse toDto(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .categoryId(t.getCategory().getId())
                .categoryName(t.getCategory().getName())
                .categoryColor(t.getCategory().getColor())
                .type(t.getType())
                .amount(t.getAmount())
                .description(t.getDescription())
                .transactionDate(t.getTransactionDate())
                .build();
    }
}