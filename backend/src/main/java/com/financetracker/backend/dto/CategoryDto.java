package com.financetracker.backend.dto;

import com.financetracker.backend.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    @NotNull(message = "Category type is required")
    private TransactionType type;

    private String color;
}