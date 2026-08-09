package com.example.TrabajoFinal.feature.Mappers;

import com.example.TrabajoFinal.feature.dtos.AlumnoRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Curso;

public class AlumnoMapper {


    public static Alumno toEntity(AlumnoRequest dto, Curso curso){
        return Alumno.builder()
                .dni(dto.dni())
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .fechaNacimiento(dto.fechaDeNacimiento())
                .curso(curso)
                .build();
    }

    public static AlumnoResponse toResponse(Alumno a, Integer asistencias){
        return new AlumnoResponse(
                a.getId(),
                a.getNombre(),
                a.getApellido(),
                CursoMapper.toResponse(a.getCurso()),
                a.getFechaNacimiento(),
                asistencias
        );
    }
}
