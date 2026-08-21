package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.dtos.LoginRequest;
import com.example.TrabajoFinal.feature.dtos.LoginResponse;
import com.example.TrabajoFinal.feature.dtos.RegisterRequest;
import com.example.TrabajoFinal.feature.dtos.UsuarioResponse;
import com.example.TrabajoFinal.feature.service.AuthService;
import com.example.TrabajoFinal.feature.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;


    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(BaseResponse.ok(response, "Inicio de sesión exitoso."));
    }


    @PostMapping("/register")
    public ResponseEntity<BaseResponse<UsuarioResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UsuarioResponse response = usuarioService.crear(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BaseResponse.ok(response, "Usuario creado correctamente."));
    }
}
