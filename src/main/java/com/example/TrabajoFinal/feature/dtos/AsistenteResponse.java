package com.example.TrabajoFinal.feature.dtos;

import java.util.List;

/**
 * Version liviana de un curso, usada dentro de AsistenteResponse para no
 * arrastrar la lista completa de asistentes de CursoResponse (evitaria
 * anidar innecesariamente Usuario -> Curso -> Usuario).
 */
public record AsistenteResponse(
        Long id,
        String nombre,
        String apellido,
        String email,
        List<CursoResumen> cursosAsignados
) {
    public record CursoResumen(Long id, String nombre) {
    }
}
