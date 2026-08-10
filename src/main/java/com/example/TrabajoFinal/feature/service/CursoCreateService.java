package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.CursoMapper;
import com.example.TrabajoFinal.feature.dtos.CursoRequest;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CursoCreateService implements ICursoCreateService{

    private final CursoRepository cursoRepository;

    @Override
    public void createCurso(CursoRequest dto) {

        if(cursoRepository.findByNombreAndActivoTrue(dto.nombre()).isPresent()) throw new BadRequestException("Ya existe un curso activo con ese nombre, ingrese un nombre que no este registrado.");

        Curso curso = CursoMapper.toEntity(dto);

        cursoRepository.save(curso);
    }
}
