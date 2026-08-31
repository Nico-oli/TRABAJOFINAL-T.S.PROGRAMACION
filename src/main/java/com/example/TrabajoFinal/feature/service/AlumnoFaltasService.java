package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.LimiteFaltasProperties;
import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlumnoFaltasService implements IAlumnoFaltasService {

    private static final Set<Integer> CANTIDADES_REINCORPORACION_VALIDAS = Set.of(5, 10, 15);

    private final AlumnoRepository alumnoRepository;
    private final LimiteFaltasProperties limites;

    /**
     * Lo utilizamos para agregar faltas cada que un asistente pone el ausente.
     */
    @Override
    @Transactional
    public void registrarFalta(Alumno alumno) {

        alumno.setFaltas(alumno.getFaltas() + 1);

        // Limite efectivo: el base mas lo que el alumno tenga acumulado por
        // reincorporaciones pagas (0 si nunca se reincorporo, igual que antes).
        int limiteEfectivo = limites.getLimiteFaltas() + alumno.getFaltasAdicionalesOtorgadas();

        if (alumno.getFaltas() >= limiteEfectivo) {
            alumno.setActivo(false);
            log.info("Alumno {} {} dado de baja por alcanzar el limite de faltas ({})",
                    alumno.getNombre(), alumno.getApellido(), limiteEfectivo);
        }

        alumnoRepository.save(alumno);
    }


    /**
     * Funcion que permite saber que alumno esta proximo al limite de faltas
     */
    @Override
    @Transactional(readOnly = true)
    public boolean estaProximoALimite(Long idAlumno) {

        Alumno alumno = alumnoRepository.findByIdAndActivoTrue(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("El alumno no fue encontrado"));

        int avisoEfectivo = limites.getFaltasAviso() + alumno.getFaltasAdicionalesOtorgadas();

        return alumno.getFaltas() >= avisoEfectivo;
    }

    /**
     * Reincorpora a un alumno acreditandole una cantidad fija de faltas
     * adicionales (5, 10 o 15 - pago de reincorporacion), que se suma de
     * forma acumulable a lo que ya tuviera otorgado y amplia su limite
     * efectivo (ver registrarFalta/estaProximoALimite). No toca el contador
     * de faltas. Se busca por id sin filtrar por activo porque el alumno a
     * reincorporar tipicamente ya esta inactivo.
     */
    @Override
    @Transactional
    public AlumnoResponse reincorporarPorFaltasAdicionales(Long idAlumno, Integer cantidadFaltasAdicionales) {

        if (!CANTIDADES_REINCORPORACION_VALIDAS.contains(cantidadFaltasAdicionales)) {
            throw new BadRequestException("La cantidad de faltas adicionales debe ser 5, 10 o 15");
        }

        Alumno alumno = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("El alumno no fue encontrado"));

        alumno.setFaltasAdicionalesOtorgadas(alumno.getFaltasAdicionalesOtorgadas() + cantidadFaltasAdicionales);
        alumno.setActivo(true);

        Alumno guardado = alumnoRepository.save(alumno);

        return AlumnoMapper.toResponse(guardado, guardado.getFaltas(), limites);
    }
}
