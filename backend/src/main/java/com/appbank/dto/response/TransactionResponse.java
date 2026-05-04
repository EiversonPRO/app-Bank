package com.appbank.dto.response;

import com.appbank.entity.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private Long id;
    private String referenceNumber;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private String originAccountNumber;
    private String destinationAccountNumber;
    private LocalDateTime createdAt;
}
