package com.appbank.repository;

import com.appbank.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUserIdAndActiveTrue(Long userId);

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findByAccountNumberAndUserId(String accountNumber, Long userId);

    boolean existsByAccountNumber(String accountNumber);
}
