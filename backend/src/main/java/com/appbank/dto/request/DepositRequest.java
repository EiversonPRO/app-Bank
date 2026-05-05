package com.appbank.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DepositRequest {

    @NotBlank(message = "El número de cuenta es obligatorio")
    private String accountNumber;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "1000.00", message = "El monto mínimo de depósito es $1.000")
    @DecimalMax(value = "50000000.00", message = "El monto máximo de depósito es $50.000.000")
    private BigDecimal amount;

    @Size(max = 200, message = "La descripción no puede superar los 200 caracteres")
    private String description;
}
