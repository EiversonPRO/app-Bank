package com.appbank.dto.request;

import com.appbank.entity.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAccountRequest {

    @NotNull(message = "El tipo de cuenta es obligatorio")
    private AccountType accountType;
}
