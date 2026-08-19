package com.example.TrabajoFinal.feature.dtos;

import com.example.TrabajoFinal.feature.models.EstadoAsistencia;

import java.time.LocalDate;

public record AsistenciaResponse(
        Long id,
        AlumnoResponse alumno,
        CursoResponse curso,
        LocalDate fecha,
        String observacion,
        EstadoAsistencia estadoAsistencia,
        String nombreAsistente
) {
}
