package com.appbank.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String fullName;
    private String email;

    public AuthResponse(String token, Long userId, String fullName, String email) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
    }
}
