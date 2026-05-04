package com.appbank.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String fullName;

    @Pattern(regexp = "^(\\+?[0-9]{7,15})?$", message = "El número de teléfono no es válido")
    private String phone;
}
