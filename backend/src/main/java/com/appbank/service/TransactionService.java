package com.appbank.service;

import com.appbank.dto.request.TransferRequest;
import com.appbank.dto.response.PageResponse;
import com.appbank.dto.response.TransactionResponse;
import com.appbank.entity.Account;
import com.appbank.entity.Transaction;
import com.appbank.entity.enums.TransactionType;
import com.appbank.exception.AppException;
import com.appbank.repository.AccountRepository;
import com.appbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public TransactionResponse transfer(Long userId, TransferRequest request) {
        if (request.getOriginAccountNumber().equals(request.getDestinationAccountNumber())) {
            throw new AppException("La cuenta origen y destino no pueden ser la misma", HttpStatus.BAD_REQUEST);
        }

        Account origin = accountRepository
                .findByAccountNumberAndUserId(request.getOriginAccountNumber(), userId)
                .orElseThrow(() -> new AppException("Cuenta de origen no encontrada o no te pertenece", HttpStatus.NOT_FOUND));

        Account destination = accountRepository
                .findByAccountNumber(request.getDestinationAccountNumber())
                .orElseThrow(() -> new AppException("Cuenta destino no encontrada", HttpStatus.NOT_FOUND));

        if (!origin.isActive()) {
            throw new AppException("La cuenta de origen está inactiva", HttpStatus.BAD_REQUEST);
        }

        if (!destination.isActive()) {
            throw new AppException("La cuenta destino está inactiva", HttpStatus.BAD_REQUEST);
        }

        if (origin.getBalance().compareTo(request.getAmount()) < 0) {
            throw new AppException("Saldo insuficiente para realizar la transferencia", HttpStatus.BAD_REQUEST);
        }

        origin.setBalance(origin.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));

        accountRepository.save(origin);
        accountRepository.save(destination);

        Transaction transaction = Transaction.builder()
                .referenceNumber(generateReferenceNumber())
                .type(TransactionType.TRANSFERENCIA_ENVIADA)
                .amount(request.getAmount())
                .description(request.getDescription())
                .originAccount(origin)
                .destinationAccount(destination)
                .build();

        transaction = transactionRepository.save(transaction);
        return toResponse(transaction);
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getTransactionsByAccount(Long accountId, Long userId, int page, int size) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException("Cuenta no encontrada", HttpStatus.NOT_FOUND));

        if (!account.getUser().getId().equals(userId)) {
            throw new AppException("No tienes acceso a esta cuenta", HttpStatus.FORBIDDEN);
        }

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepository.findByAccountId(accountId, pageable);

        List<TransactionResponse> content = transactionPage.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                transactionPage.getNumber(),
                transactionPage.getSize(),
                transactionPage.getTotalElements(),
                transactionPage.getTotalPages(),
                transactionPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getRecentTransactions(Long userId) {
        PageRequest pageable = PageRequest.of(0, 10);
        return transactionRepository.findRecentByUserId(userId, pageable)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private String generateReferenceNumber() {
        return "TRX-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .referenceNumber(t.getReferenceNumber())
                .type(t.getType())
                .amount(t.getAmount())
                .description(t.getDescription())
                .originAccountNumber(t.getOriginAccount() != null ? t.getOriginAccount().getAccountNumber() : null)
                .destinationAccountNumber(t.getDestinationAccount() != null ? t.getDestinationAccount().getAccountNumber() : null)
                .createdAt(t.getCreatedAt())
                .build();
    }
}
