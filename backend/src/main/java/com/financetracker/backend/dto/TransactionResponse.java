package com.financetracker.backend.dto;

import com.financetracker.backend.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;
}



