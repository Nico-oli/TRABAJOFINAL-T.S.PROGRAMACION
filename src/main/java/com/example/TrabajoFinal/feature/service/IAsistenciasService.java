package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.AsistenciaRequest;
import com.example.TrabajoFinal.feature.models.Usuario;

import java.util.List;

public interface IAsistenciasService {
    void guardarAsistencia(List<AsistenciaRequest> listaDto, Usuario asistente);
}
