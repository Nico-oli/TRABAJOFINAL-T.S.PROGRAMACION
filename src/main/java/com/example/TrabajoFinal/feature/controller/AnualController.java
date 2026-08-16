package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.service.ICambioAnioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AnualController {

    private final ICambioAnioService cambioAnioService;

    @PostMapping("/cambiarAnio")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<BaseResponse<?>> cambioDeAnio(){

        cambioAnioService.cambioAnual();

        return ResponseEntity.ok(BaseResponse.noContent("Actualizado con exito"));

    }
}
