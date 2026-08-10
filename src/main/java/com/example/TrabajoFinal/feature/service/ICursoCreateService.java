package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.CursoRequest;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;

public interface ICursoCreateService {
    void createCurso(CursoRequest dto);
}
