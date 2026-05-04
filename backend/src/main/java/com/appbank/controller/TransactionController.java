package com.appbank.controller;

import com.appbank.dto.request.TransferRequest;
import com.appbank.dto.response.ApiResponse;
import com.appbank.dto.response.PageResponse;
import com.appbank.dto.response.TransactionResponse;
import com.appbank.security.UserDetailsImpl;
import com.appbank.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody TransferRequest request) {

        TransactionResponse response = transactionService.transfer(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Transferencia realizada exitosamente", response));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<ApiResponse<PageResponse<TransactionResponse>>> getTransactionsByAccount(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<TransactionResponse> transactions =
                transactionService.getTransactionsByAccount(accountId, userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(transactions));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getRecentTransactions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        List<TransactionResponse> transactions = transactionService.getRecentTransactions(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(transactions));
    }
}
