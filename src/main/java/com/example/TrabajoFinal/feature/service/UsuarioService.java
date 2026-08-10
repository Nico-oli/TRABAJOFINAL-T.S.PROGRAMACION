package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ConflictException;
import com.example.TrabajoFinal.feature.dtos.RegisterRequest;
import com.example.TrabajoFinal.feature.dtos.UsuarioResponse;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * Gestión de usuarios del sistema (alta, y a futuro: baja lógica, cambio de rol, etc.).
 * Se separa de AuthService porque son responsabilidades distintas:
 * AuthService valida credenciales y emite tokens; UsuarioService administra
 * el ciclo de vida de la entidad Usuario.
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Crea un nuevo usuario (Administrador o Asistente). Pensado para ser utilizado
     * únicamente por un Administrador ya autenticado.
     */
    @Transactional
    public UsuarioResponse crear(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new ConflictException("Ya existe un usuario registrado con ese email.");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.nombre())
                .apellido(request.apellido())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .rol(request.rol())
                .activo(true)
                .build();

        usuario = usuarioRepository.save(usuario);

        return UsuarioResponse.fromEntity(usuario);
    }
}
