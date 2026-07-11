package com.financetracker.backend.repository;

import com.financetracker.backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    Page<Transaction> findByUserIdOrderByTransactionDateDescCreatedAtDesc(Long userId, Pageable pageable);

    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = com.financetracker.backend.entity.TransactionType.INCOME " +
            "AND t.transactionDate BETWEEN :start AND :end")
    BigDecimal sumIncomeBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = com.financetracker.backend.entity.TransactionType.EXPENSE " +
            "AND t.transactionDate BETWEEN :start AND :end")
    BigDecimal sumExpenseBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT t.category.id, t.category.name, t.category.color, COALESCE(SUM(t.amount), 0) " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = com.financetracker.backend.entity.TransactionType.EXPENSE " +
            "AND t.transactionDate BETWEEN :start AND :end " +
            "GROUP BY t.category.id, t.category.name, t.category.color " +
            "ORDER BY SUM(t.amount) DESC")
    List<Object[]> sumExpensesByCategoryBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.category.id = :categoryId " +
            "AND t.type = com.financetracker.backend.entity.TransactionType.EXPENSE " +
            "AND t.transactionDate BETWEEN :start AND :end")
    BigDecimal sumExpenseByCategoryBetween(@Param("userId") Long userId, @Param("categoryId") Long categoryId,
                                           @Param("start") LocalDate start, @Param("end") LocalDate end);
}