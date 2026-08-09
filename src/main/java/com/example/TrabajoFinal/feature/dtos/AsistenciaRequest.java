package com.example.TrabajoFinal.feature.dtos;

import com.example.TrabajoFinal.feature.models.EstadoAsistencia;

public record AsistenciaRequest(
       Long idAlumno,
       Long idCurso,
       EstadoAsistencia estadoAsistencia,
       String observacion
) {
}
