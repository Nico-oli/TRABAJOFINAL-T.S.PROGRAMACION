package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.CursoMapper;
import com.example.TrabajoFinal.feature.dtos.CursoActualizarRequest;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CursoActualizarService implements ICursoActualizarService{

    private final CursoRepository cursoRepository;


    @Override
    public CursoResponse actualizarCurso(Long idCurso, CursoActualizarRequest dto) {

        if(dto.turno().isBlank() && dto.nombre().isBlank() && dto.anioLectivo() == null){
            throw new BadRequestException("Todos los campos estan vacios, para actualizat por lo menos debe llenar un campo");
        }

        Curso curso = cursoRepository.findByIdAndActivoTrue(idCurso)
                .orElseThrow(()-> new ResourceNotFoundException("El curso no fue encontrado"));

        if(!dto.nombre().isBlank()) curso.setNombre(dto.nombre());
        if(dto.anioLectivo() != null) curso.setAnioLectivo(dto.anioLectivo());
        if(!dto.turno().isBlank()) curso.setTurno(dto.turno());

        curso = cursoRepository.save(curso);

        return CursoMapper.toResponse(curso);
    }
}
