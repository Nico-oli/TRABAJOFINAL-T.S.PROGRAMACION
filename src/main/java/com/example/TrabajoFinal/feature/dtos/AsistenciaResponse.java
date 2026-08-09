package com.example.TrabajoFinal.feature.dtos;

import java.time.LocalDate;

public record AsistenciaResponse(
        AlumnoResponse alumno,
        CursoResponse curso,
        LocalDate fecha,
        String observacion,
        String nombreAsistente
) {
}
