package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.service.IAsignarAsistenteService;
import com.example.TrabajoFinal.feature.service.IUsuarioDeleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsignarAsistenteController {

    private final IAsignarAsistenteService asignarAsistenteService;
    private final IUsuarioDeleteService usuarioDeleteService;

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

    @DeleteMapping("/admin/usuario/{idUsuario}")
    public ResponseEntity<BaseResponse<?>> darDeBaja(
            @PathVariable Long idUsuario
    ){
        usuarioDeleteService.deleteUsuario(idUsuario);

        return ResponseEntity.ok(
                BaseResponse.noContent("Usuario dado de baja con exito")
        );
    }
}
