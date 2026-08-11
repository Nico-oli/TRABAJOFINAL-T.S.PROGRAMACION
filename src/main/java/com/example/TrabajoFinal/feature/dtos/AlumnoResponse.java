package com.example.TrabajoFinal.feature.dtos;

import java.time.LocalDate;
import java.util.List;

public record AlumnoResponse(
        Long id,
        String nombre,
        String apellido,
        CursoResponse curso,
        LocalDate fechaNacimiento,
        Integer inAsistencias,
        /**
         * Listado completo de asistencias del alumno. Solo se completa cuando
         * se consulta un alumno puntual por id, en los listados generales
         * (por curso) queda en null y solo viaja el conteo de inAsistencias.
         */
        List<AsistenciaResponse> asistencias

) {
}
