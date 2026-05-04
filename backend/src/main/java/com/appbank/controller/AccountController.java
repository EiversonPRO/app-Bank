package com.appbank.controller;

import com.appbank.dto.request.CreateAccountRequest;
import com.appbank.dto.response.AccountResponse;
import com.appbank.dto.response.ApiResponse;
import com.appbank.security.UserDetailsImpl;
import com.appbank.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateAccountRequest request) {

        AccountResponse response = accountService.createAccount(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Cuenta creada exitosamente", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getMyAccounts(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        List<AccountResponse> accounts = accountService.getUserAccounts(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(accounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {

        AccountResponse account = accountService.getAccountById(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(account));
    }
}
