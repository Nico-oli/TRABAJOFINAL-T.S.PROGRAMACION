package com.example.TrabajoFinal.feature.dtos;

import com.example.TrabajoFinal.feature.models.EstadoAsistencia;

public record AsistenciaEstadoRequest(
        EstadoAsistencia estado,
        String observacion
) {
}
