package com.example.TrabajoFinal.feature.dtos;

import com.example.TrabajoFinal.feature.models.Rol;
import com.example.TrabajoFinal.feature.models.Usuario;

public record UsuarioResponse(
        Long id,
        String nombre,
        String apellido,
        String email,
        Rol rol
) {
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}
