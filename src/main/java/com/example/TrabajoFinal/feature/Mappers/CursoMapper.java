package com.example.TrabajoFinal.feature.Mappers;

import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Usuario;

public class CursoMapper {



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
