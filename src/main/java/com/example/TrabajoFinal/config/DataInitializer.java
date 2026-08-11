package com.example.TrabajoFinal.config;

import com.example.TrabajoFinal.feature.models.Rol;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Crea un usuario Administrador por defecto al arrancar la aplicación,
 * únicamente si todavía no existe ningún usuario en la base de datos.
 * Así se puede iniciar sesión por primera vez sin tener que insertar
 * datos manualmente.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        Usuario admin = Usuario.builder()
                .nombre("Admin")
                .apellido("Sistema")
                .email(defaultAdminEmail)
                .password(passwordEncoder.encode(defaultAdminPassword))
                .rol(Rol.ADMINISTRADOR)
                .activo(true)
                .build();

        usuarioRepository.save(admin);

        log.info("Usuario Administrador por defecto creado con email '{}'.", defaultAdminEmail);
    }
}
