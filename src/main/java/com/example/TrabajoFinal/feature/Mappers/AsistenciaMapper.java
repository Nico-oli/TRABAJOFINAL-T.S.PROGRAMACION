package com.example.TrabajoFinal.feature.Mappers;

import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Asistencia;

public class AsistenciaMapper {

    private AsistenciaMapper() {
    }

    /**
     * Recibe el AlumnoResponse ya construido (en lugar de reconstruirlo acá)
     * para no volver a golpear la base de datos por cada asistencia y para
     * evitar anidar recursivamente la lista de asistencias dentro de sí misma.
     */
    public static AsistenciaResponse toResponse(Asistencia asistencia, AlumnoResponse alumno){
        return new AsistenciaResponse(
                alumno,
                CursoMapper.toResponse(asistencia.getCurso()),
                asistencia.getFecha(),
                asistencia.getObservacion(),
                asistencia.getRegistradoPor().getNombre() + " " + asistencia.getRegistradoPor().getApellido()
        );
    }
}
