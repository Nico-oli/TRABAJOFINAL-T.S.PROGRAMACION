package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Usuario;

import java.util.List;

public interface ICursoGetService {
    List<CursoResponse> getAll(Usuario usuario);
    CursoResponse getCursoPorId(Long idCurso);
}
