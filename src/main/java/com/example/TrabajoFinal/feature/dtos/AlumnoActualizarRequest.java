package com.example.TrabajoFinal.feature.dtos;

public record AlumnoActualizarRequest(
        String nombre,
        String apellido,
        Long idCurso,
        Integer faltas
) {
}
