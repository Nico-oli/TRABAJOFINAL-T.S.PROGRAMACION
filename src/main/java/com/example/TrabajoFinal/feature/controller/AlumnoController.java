package com.example.TrabajoFinal.feature.controller;

import com.example.TrabajoFinal.config.BaseResponse;
import com.example.TrabajoFinal.feature.dtos.AlumnoActualizarRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.service.IActualizarAlumno;
import com.example.TrabajoFinal.feature.service.IAlumnoCreateService;
import com.example.TrabajoFinal.feature.service.IAlumnoDeleteService;
import com.example.TrabajoFinal.feature.service.IAlumnoGetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AlumnoController {

    private final IAlumnoCreateService createService;
    private final IAlumnoGetService getService;
    private final IActualizarAlumno actualizarService;
    private final IAlumnoDeleteService deleteService;

    @PostMapping("/admin/alumno")
    public ResponseEntity<BaseResponse<?>> create(
            @Valid @RequestBody AlumnoRequest dto
    ){

        createService.createAlumno(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
          BaseResponse.noContent("Alumno Registrado con exito.")
        );
    }

    @GetMapping("/asistencias/alumno/curso/{idCurso}")
    public ResponseEntity<BaseResponse<?>> getPorCurso(
            @PathVariable Long idCurso
    ){
        List<AlumnoResponse> alumnos = getService.getAlumnoPorCurso(idCurso);

        return ResponseEntity.ok(
                BaseResponse.ok(alumnos, "Alumnos obtenidos con exito.")
        );
    }

    @GetMapping("/asistencias/alumno/{idAlumno}")
    public ResponseEntity<BaseResponse<?>> getAlumno(
            @PathVariable Long idAlumno
    ){
        AlumnoResponse alumno = getService.getAlumno(idAlumno);

        return ResponseEntity.ok(
                BaseResponse.ok(alumno, "Alumno obtenido con exito.")
        );
    }

    @PatchMapping("/admin/alumno/{idAlumno}")
    public ResponseEntity<BaseResponse<AlumnoResponse>> actualizar(
            @PathVariable Long idAlumno,
            @Valid @RequestBody AlumnoActualizarRequest actualizarAlumno

            ){

        AlumnoResponse response = actualizarService.actualizarAlumno(idAlumno, actualizarAlumno);

        return ResponseEntity.ok(
          BaseResponse.ok(
                response,
                  "Alumno actualizado con exito"
          )
        );
    }

    @DeleteMapping("/admin/alumno/{idAlumno}")
    public  ResponseEntity<BaseResponse<?>> softDelete(
            @PathVariable Long idAlumno
    ){
        deleteService.deleteAlumno(idAlumno);

        return ResponseEntity.ok(
                BaseResponse.noContent("Se elimino con exito")
        );
    }

}
