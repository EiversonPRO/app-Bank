package com.appbank.repository;

import com.appbank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query(
            value = "SELECT * FROM transactions WHERE origin_account_id = :accountId OR destination_account_id = :accountId ORDER BY created_at DESC",
            countQuery = "SELECT COUNT(*) FROM transactions WHERE origin_account_id = :accountId OR destination_account_id = :accountId",
            nativeQuery = true
    )
    Page<Transaction> findByAccountId(@Param("accountId") Long accountId, Pageable pageable);

    @Query(
            value = "SELECT t.* FROM transactions t LEFT JOIN accounts a ON (t.origin_account_id = a.id OR t.destination_account_id = a.id) WHERE a.user_id = :userId ORDER BY t.created_at DESC LIMIT 10",
            nativeQuery = true
    )
    List<Transaction> findRecentByUserId(@Param("userId") Long userId);
}
