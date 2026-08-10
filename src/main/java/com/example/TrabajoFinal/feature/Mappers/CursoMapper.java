package com.example.TrabajoFinal.feature.Mappers;

import com.example.TrabajoFinal.feature.dtos.CursoRequest;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Usuario;

public class CursoMapper {

    private CursoMapper(){
    }

    public static Curso toEntity(CursoRequest dto){
        return Curso.builder()
                .nombre(dto.nombre())
                .anioLectivo(dto.anioLectivo())
                .turno(dto.turno())
                .build();
    }


    public static CursoResponse toResponse(Curso c){
        return new CursoResponse(
                c.getId(),
                c.getNombre(),
                c.getAnioLectivo(),
                c.getTurno(),
                c.getAsistentes().stream().map(Usuario::getNombre).toList()
        );
    }
}
