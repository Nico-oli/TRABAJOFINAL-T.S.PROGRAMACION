package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.dtos.AlumnoRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.service.IAlumnoCreateService;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AlumnoController {

    private final AlumnoRepository alumnoRepository;
    private final IAlumnoCreateService createService;

    @PostMapping("/alumno")
    public ResponseEntity<BaseResponse<?>> create(
            @Valid @RequestBody AlumnoRequest dto
    ){

        createService.createAlumno(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
          BaseResponse.noContent("Alumno Registrado con exito.")
        );
    }
}
