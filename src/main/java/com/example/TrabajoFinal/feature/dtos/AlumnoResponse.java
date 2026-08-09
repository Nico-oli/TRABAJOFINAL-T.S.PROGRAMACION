package com.example.TrabajoFinal.feature.dtos;

import java.time.LocalDate;

public record AlumnoResponse(
        Long id,
        String nombre,
        String apellido,
        CursoResponse curso,
        LocalDate fechaNacimiento,
        Integer inAsistencias

) {
}
