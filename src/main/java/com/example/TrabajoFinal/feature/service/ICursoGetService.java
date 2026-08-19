package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Usuario;

import java.util.List;

public interface ICursoGetService {
    List<CursoResponse> getAll(Long idUsuario);
    CursoResponse getCursoPorId(Long idCurso);
}
