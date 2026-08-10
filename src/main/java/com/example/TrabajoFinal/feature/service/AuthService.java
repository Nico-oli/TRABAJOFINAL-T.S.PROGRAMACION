package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.UnauthorizedException;
import com.example.TrabajoFinal.config.security.JwtService;
import com.example.TrabajoFinal.feature.dtos.LoginRequest;
import com.example.TrabajoFinal.feature.dtos.LoginResponse;
import com.example.TrabajoFinal.feature.dtos.UsuarioResponse;
import com.example.TrabajoFinal.feature.models.Usuario;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * Responsable únicamente de autenticar usuarios y emitir el JWT correspondiente.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /**
     * Valida las credenciales y devuelve un JWT junto con los datos del usuario.
     */
    public LoginResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (DisabledException e) {
            throw new UnauthorizedException("El usuario se encuentra dado de baja.");
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Email o contraseña incorrectos.");
        }

        // El propio proceso de autenticación ya cargó el usuario (vía
        // CustomUserDetailsService): lo reutilizamos en vez de volver a
        // consultar la base de datos.
        Usuario usuario = (Usuario) authentication.getPrincipal();

        String token = jwtService.generateToken(usuario);

        return LoginResponse.of(token, UsuarioResponse.fromEntity(usuario));
    }
}
