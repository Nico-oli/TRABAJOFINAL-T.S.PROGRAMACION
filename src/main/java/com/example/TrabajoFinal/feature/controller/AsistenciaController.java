package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaEstadoRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.feature.service.IAsistenciasService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsistenciaController {

    private final IAsistenciasService asistenciasService;


    @PostMapping("/asistencias/asistencia")
    public ResponseEntity<BaseResponse<?>> guardar(
            @AuthenticationPrincipal Usuario asistente,
            @Valid @RequestBody List<AsistenciaRequest> dto
            ){
        asistenciasService.guardarAsistencia(dto,asistente);

        return ResponseEntity.ok(
                BaseResponse.noContent("Asistencias almacenadas")
        );}


    @PatchMapping("/admin/asistencia/{idAsistencia}")
    public ResponseEntity<BaseResponse<?>> actualizar(
            @PathVariable Long idAsistencia,
            @RequestBody AsistenciaEstadoRequest dto
            ){
        asistenciasService.actualizarEstado(dto, idAsistencia);

        return ResponseEntity.ok(
                BaseResponse.noContent("Actualizado con exito")
        );
    }

    @DeleteMapping("/admin/asistencia/{idAsistencia}")
    public ResponseEntity<BaseResponse<?>> softDelete(
            @PathVariable Long idAsistencia
    ){

        asistenciasService.eliminarAsistencia(idAsistencia);

        return ResponseEntity.ok(
                BaseResponse.noContent("Eliminado con exito")
        );
    }

    @DeleteMapping("/admin/asistencia/cambioAnual")
    public ResponseEntity<BaseResponse<?>> deleteForAnio(){

        asistenciasService.eliminarAsistenciasPorAnio();

        return ResponseEntity.ok(
                BaseResponse.noContent("Se eliminaron asistencias de años anteriores")
        );
    }

    @PostMapping("/admin/asistencia/{idCurso}")
    public ResponseEntity<BaseResponse<List<AsistenciaResponse>>> getForFecha(
            @RequestBody LocalDate fecha,
            @PathVariable Long idCurso
            ){

        return ResponseEntity.ok(
                BaseResponse.ok(
                        asistenciasService.getAsistenciasPorFecha(fecha,idCurso),
                        "Exito"
                )
        );

    }
}
