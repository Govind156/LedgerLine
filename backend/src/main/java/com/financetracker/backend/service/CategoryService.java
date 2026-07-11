package com.financetracker.backend.service;

import com.financetracker.backend.dto.CategoryDto;
import com.financetracker.backend.entity.Category;
import com.financetracker.backend.entity.TransactionType;
import com.financetracker.backend.entity.User;
import com.financetracker.backend.exception.DuplicateResourceException;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private static final String[] DEFAULT_EXPENSE_CATEGORIES = {
            "Groceries", "Rent", "Utilities", "Transportation", "Dining Out",
            "Entertainment", "Healthcare", "Shopping", "Insurance", "Other Expense"
    };
    private static final String[] DEFAULT_INCOME_CATEGORIES = {
            "Salary", "Freelance", "Investments", "Gifts", "Other Income"
    };
    private static final String[] DEFAULT_COLORS = {
            "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4",
            "#a855f7", "#ec4899", "#84cc16", "#f97316", "#14b8a6"
    };

    @Transactional
    public void createDefaultCategoriesForUser(User user) {
        int colorIndex = 0;
        for (String name : DEFAULT_EXPENSE_CATEGORIES) {
            categoryRepository.save(Category.builder()
                    .user(user).name(name).type(TransactionType.EXPENSE)
                    .color(DEFAULT_COLORS[colorIndex++ % DEFAULT_COLORS.length])
                    .build());
        }
        for (String name : DEFAULT_INCOME_CATEGORIES) {
            categoryRepository.save(Category.builder()
                    .user(user).name(name).type(TransactionType.INCOME)
                    .color(DEFAULT_COLORS[colorIndex++ % DEFAULT_COLORS.length])
                    .build());
        }
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories(Long userId, TransactionType type) {
        List<Category> categories = (type != null)
                ? categoryRepository.findByUserIdAndTypeOrderByNameAsc(userId, type)
                : categoryRepository.findByUserIdOrderByNameAsc(userId);
        return categories.stream().map(this::toDto).toList();
    }

    @Transactional
    public CategoryDto createCategory(Long userId, User userRef, CategoryDto dto) {
        if (categoryRepository.existsByUserIdAndNameIgnoreCaseAndType(userId, dto.getName(), dto.getType())) {
            throw new DuplicateResourceException("A category with this name and type already exists");
        }
        Category category = Category.builder()
                .user(userRef)
                .name(dto.getName())
                .type(dto.getType())
                .color(dto.getColor() != null ? dto.getColor() : "#6366f1")
                .build();
        return toDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long userId, Long categoryId, CategoryDto dto) {
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(dto.getName());
        category.setType(dto.getType());
        if (dto.getColor() != null) {
            category.setColor(dto.getColor());
        }
        return toDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .color(category.getColor())
                .build();
    }
}