package com.example.TrabajoFinal.feature.Mappers;

import com.example.TrabajoFinal.config.LimiteFaltasProperties;
import com.example.TrabajoFinal.feature.dtos.AlumnoRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Curso;

import java.util.List;

public class AlumnoMapper {

    private AlumnoMapper() {
    }

    public static Alumno toEntity(AlumnoRequest dto, Curso curso){
        return Alumno.builder()
                .dni(dto.dni())
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .fechaNacimiento(dto.fechaDeNacimiento())
                .curso(curso)
                .build();
    }

    /**
     * Usado cuando no corresponde exponer el detalle de asistencias
     * (alta de alumno, listado general por curso).
     */
    public static AlumnoResponse toResponse(Alumno a, Integer inAsistencias, LimiteFaltasProperties limites){
        return toResponse(a, inAsistencias, null, limites);
    }

    /**
     * Usado cuando se consulta un alumno puntual, donde además del conteo
     * de inasistencias se devuelve el detalle completo de asistencias.
     */
    public static AlumnoResponse toResponse(Alumno a, Integer inAsistencias, List<AsistenciaResponse> asistencias, LimiteFaltasProperties limites){
        Integer otorgadas = a.getFaltasAdicionalesOtorgadas();
        return new AlumnoResponse(
                a.getId(),
                a.getNombre(),
                a.getApellido(),
                CursoMapper.toResponse(a.getCurso()),
                a.getFechaNacimiento(),
                inAsistencias,
                asistencias,
                otorgadas,
                limites.getLimiteFaltas() + otorgadas,
                limites.getFaltasAviso() + otorgadas
        );
    }
}
