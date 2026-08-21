package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenteResponse;
import com.example.TrabajoFinal.feature.service.IAsignarAsistenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsignarAsistenteController {

    private final IAsignarAsistenteService asignarAsistenteService;

    // Va bajo /api/admin/**, protegido para ADMINISTRADOR por SecurityConfig.
    @GetMapping("/admin/usuario/asistentes")
    public ResponseEntity<BaseResponse<List<AsistenteResponse>>> listarAsistentes() {
        List<AsistenteResponse> asistentes = asignarAsistenteService.listarAsistentes();
        return ResponseEntity.ok(
                BaseResponse.ok(asistentes, "Asistentes obtenidos con exito")
        );
    }

    @PostMapping("/admin/usuario/{idUsuario}/curso/{idCurso}")
    public ResponseEntity<BaseResponse<?>> asignarCurso(
        @PathVariable Long idUsuario,
        @PathVariable Long idCurso
    ){
        asignarAsistenteService.asignarAsistenet(idUsuario, idCurso);

        return ResponseEntity.ok(
                BaseResponse.noContent("Curso asignado con exito")
        );
    }

    @DeleteMapping("/admin/usuario/{idUsuario}/curso/{idCurso}")
    public ResponseEntity<BaseResponse<?>> desasignarCurso(
            @PathVariable Long idUsuario,
            @PathVariable Long idCurso
    ){

        asignarAsistenteService.quitarAsistente(idUsuario, idCurso);

        return ResponseEntity.ok(
                BaseResponse.noContent("Curso desasignado con exito")
        );
    }
}
