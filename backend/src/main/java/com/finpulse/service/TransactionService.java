package com.finpulse.service;

import com.finpulse.dto.TransactionRequest;
import com.finpulse.dto.TransactionResponse;
import com.finpulse.entity.Transaction;
import com.finpulse.entity.User;
import com.finpulse.exception.ResourceNotFoundException;
import com.finpulse.repository.TransactionRepository;
import com.finpulse.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final SecurityUtils securityUtils;

    public TransactionService(TransactionRepository transactionRepository, SecurityUtils securityUtils) {
        this.transactionRepository = transactionRepository;
        this.securityUtils = securityUtils;
    }

    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = securityUtils.getCurrentUser();

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction saved = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(saved);
    }

    public List<TransactionResponse> getAllTransactions() {
        User user = securityUtils.getCurrentUser();
        return transactionRepository.findByUserOrderByTransactionDateDesc(user).stream()
                .map(TransactionResponse::fromEntity)
                .toList();
    }

    public TransactionResponse getTransactionById(Long id) {
        User user = securityUtils.getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found."));
        return TransactionResponse.fromEntity(transaction);
    }

    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = securityUtils.getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found."));

        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction saved = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(saved);
    }

    public void deleteTransaction(Long id) {
        User user = securityUtils.getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found."));
        transactionRepository.delete(transaction);
    }

    public List<TransactionResponse> getMonthlyTransactions() {
        User user = securityUtils.getCurrentUser();
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();

        return transactionRepository.findByUserAndTransactionDateBetween(user, start, end).stream()
                .map(TransactionResponse::fromEntity)
                .toList();
    }
}
