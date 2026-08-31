package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.AsistenciaEstadoRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Usuario;

import java.time.LocalDate;
import java.util.List;

public interface IAsistenciasService {
    void guardarAsistencia(List<AsistenciaRequest> listaDto, Usuario asistente);
    void actualizarEstado(AsistenciaEstadoRequest dto, Long idAsistencias);
    void eliminarAsistencia(Long idAsistencia);
    void eliminarAsistenciasPorAnio();
    List<AsistenciaResponse> getAsistenciasPorFecha(LocalDate fecha, Long idCurso);
}
