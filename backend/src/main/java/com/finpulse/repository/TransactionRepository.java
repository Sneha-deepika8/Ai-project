package com.finpulse.repository;

import com.finpulse.entity.Transaction;
import com.finpulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    List<Transaction> findByUserAndTransactionDateBetween(User user, LocalDate start, LocalDate end);

    long countByUser(User user);

    long countByUserAndType(User user, Transaction.TransactionType type);
}