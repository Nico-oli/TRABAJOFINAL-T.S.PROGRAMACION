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
        List<AsistenciaResponse> asistencias,

        /**
         * Cupo acumulado otorgado por reincorporaciones pagas (ver
         * AlumnoFaltasService.reincorporarPorFaltasAdicionales). 0 si el
         * alumno nunca fue reincorporado.
         */
        Integer faltasAdicionalesOtorgadas,

        /**
         * Límite de faltas efectivo de este alumno en particular
         * (limite-faltas + faltasAdicionalesOtorgadas). El backend es la
         * única fuente de verdad de este número — el frontend NO debe
         * hardcodear ningún límite fijo, siempre mostrar/comparar contra
         * este campo.
         */
        Integer limiteFaltasEfectivo,

        /**
         * Umbral de aviso efectivo (faltas-aviso + faltasAdicionalesOtorgadas),
         * mismo criterio que limiteFaltasEfectivo pero para el estado
         * "próximo al límite"/"en riesgo".
         */
        Integer avisoFaltasEfectivo

) {
}
