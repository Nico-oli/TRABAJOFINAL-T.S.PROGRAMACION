package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.dtos.CursoActualizarRequest;
import com.example.TrabajoFinal.feature.dtos.CursoRequest;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.feature.service.ICursoActualizarService;
import com.example.TrabajoFinal.feature.service.ICursoCreateService;
import com.example.TrabajoFinal.feature.service.ICursoDeBajaService;
import com.example.TrabajoFinal.feature.service.ICursoGetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CursoController {

    private final ICursoCreateService createService;
    private final ICursoActualizarService actualizarService;
    private final ICursoDeBajaService bajaService;
    private final ICursoGetService getService;

    @PostMapping("/admin/curso")
    public ResponseEntity<BaseResponse<?>> create(
            @Valid @RequestBody CursoRequest dto
            ){

        createService.createCurso(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
          BaseResponse.noContent("Creado con exito")
        );
    }

    @PatchMapping("/admin/curso/{idCurso}")
    public ResponseEntity<BaseResponse<CursoResponse>> actualizar(
            @PathVariable Long idCurso, @Valid @RequestBody CursoActualizarRequest dto
    ){
        return ResponseEntity.ok(
                BaseResponse.ok(
                    actualizarService.actualizarCurso(idCurso, dto),
                        "Curso actualizado con exito"
                )
        );
    }

    @DeleteMapping("/admin/curso/{idCurso}")
    public ResponseEntity<BaseResponse<?>> delete(
            @PathVariable Long idCurso
    ){

        bajaService.darDeBaja(idCurso);

        return ResponseEntity.ok(
          BaseResponse.noContent("Curso dado de baja con exito")
        );
    }

    @GetMapping("/asistencias/curso")
    public ResponseEntity<BaseResponse<List<CursoResponse>>> getAll(
            @AuthenticationPrincipal Usuario usuario
            ){

        return ResponseEntity.ok(
                BaseResponse.ok(
                        getService.getAll(usuario.getId()),
                        "Se trajeron todos los cursos disponibles."
                )
        );

    }

}
