package com.appbank.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {

    @NotBlank(message = "La cuenta de origen es obligatoria")
    private String originAccountNumber;

    @NotBlank(message = "La cuenta destino es obligatoria")
    private String destinationAccountNumber;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "1000.00", message = "El monto mínimo de transferencia es $1.000")
    @DecimalMax(value = "50000000.00", message = "El monto máximo de transferencia es $50.000.000")
    private BigDecimal amount;

    @Size(max = 200, message = "La descripción no puede superar los 200 caracteres")
    private String description;
}
