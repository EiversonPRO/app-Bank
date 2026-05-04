package com.appbank.service;

import com.appbank.dto.request.CreateAccountRequest;
import com.appbank.dto.response.AccountResponse;
import com.appbank.entity.Account;
import com.appbank.entity.User;
import com.appbank.exception.AppException;
import com.appbank.repository.AccountRepository;
import com.appbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public AccountResponse createAccount(Long userId, CreateAccountRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(request.getAccountType())
                .balance(BigDecimal.ZERO)
                .user(user)
                .build();

        account = accountRepository.save(account);
        return toResponse(account);
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getUserAccounts(Long userId) {
        return accountRepository.findByUserIdAndActiveTrue(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccountById(Long accountId, Long userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException("Cuenta no encontrada", HttpStatus.NOT_FOUND));

        if (!account.getUser().getId().equals(userId)) {
            throw new AppException("No tienes acceso a esta cuenta", HttpStatus.FORBIDDEN);
        }

        return toResponse(account);
    }

    private String generateUniqueAccountNumber() {
        String number;
        do {
            StringBuilder sb = new StringBuilder("APP");
            for (int i = 0; i < 10; i++) {
                sb.append(RANDOM.nextInt(10));
            }
            number = sb.toString();
        } while (accountRepository.existsByAccountNumber(number));
        return number;
    }

    public AccountResponse toResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .active(account.isActive())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
