package com.financetracker.backend.controller;

import com.financetracker.backend.dto.CategoryDto;
import com.financetracker.backend.entity.TransactionType;
import com.financetracker.backend.security.CurrentUserProvider;
import com.financetracker.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories(
            @RequestParam(required = false) TransactionType type) {
        Long userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(categoryService.getAllCategories(userId, type));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto dto) {
        Long userId = currentUserProvider.getCurrentUserId();
        CategoryDto created = categoryService.createCategory(userId, currentUserProvider.getCurrentUser(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto dto) {
        Long userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(categoryService.updateCategory(userId, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Long userId = currentUserProvider.getCurrentUserId();
        categoryService.deleteCategory(userId, id);
        return ResponseEntity.noContent().build();
    }
}