package com.example.TrabajoFinal.feature.Mappers;

import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Asistencia;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Usuario;

public class AsistenciaMapper {

    private AsistenciaMapper() {
    }

    public static Asistencia toEntity(AsistenciaRequest dto, Curso curso, Alumno alumno, Usuario asistente){
        return Asistencia.builder()
                .alumno(alumno)
                .curso(curso)
                .observacion(dto.observacion())
                .estado(dto.estadoAsistencia())
                .registradoPor(asistente)
                .build();
    }


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
