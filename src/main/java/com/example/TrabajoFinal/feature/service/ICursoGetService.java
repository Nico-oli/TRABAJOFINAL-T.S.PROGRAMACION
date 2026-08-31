package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.CursoResponse;

import java.util.List;

public interface ICursoGetService {
    List<CursoResponse> getAll(Long idUsuario);
    CursoResponse getCursoPorId(Long idCurso);
}
