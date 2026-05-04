package com.appbank.controller;

import com.appbank.dto.request.UpdateProfileRequest;
import com.appbank.dto.response.ApiResponse;
import com.appbank.dto.response.UserProfileResponse;
import com.appbank.security.UserDetailsImpl;
import com.appbank.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        UserProfileResponse profile = userService.getProfile(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserProfileResponse profile = userService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Perfil actualizado correctamente", profile));
    }
}
