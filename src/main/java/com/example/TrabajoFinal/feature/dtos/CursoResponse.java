package com.example.TrabajoFinal.feature.dtos;

import java.util.List;
import java.util.Set;

public record CursoResponse (
        long id,
        String nombre,
        Integer anioLectivo,
        String turno,
        List<String> asistentes
        ){
}
