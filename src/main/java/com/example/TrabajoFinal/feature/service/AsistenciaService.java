package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.LimiteFaltasProperties;
import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.Mappers.AsistenciaMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaEstadoRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaRequest;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.*;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.AsistenciaRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsistenciaService implements IAsistenciasService{

    private final AsistenciaRepository asistenciaRepository;
    private final CursoRepository cursoRepository;
    private final AlumnoRepository alumnoRepository;
    private final AlumnoFaltasService faltasService;
    private final LimiteFaltasProperties limites;

    @Override
    @Transactional
    public void guardarAsistencia(List<AsistenciaRequest> listaDto, Usuario asistente) {

        // Revisa uno por uno todos los alumnos y cursos para convertir las asistencias
        // si una de las asistencias teine datos incorrectos el sistema no sube ninguna falta
        // para que no suba unicamente la mitad de asistencias(sube todas o ninguna)
        List<Asistencia> asistencias = listaDto.stream()
                .map((a)->{

                    Curso curso = cursoRepository.findByIdAndActivoTrue(a.idCurso())
                            .orElseThrow(()-> new ResourceNotFoundException("Uno de los Cursos no fue encontrado"));
                    Alumno alumno = alumnoRepository.findByIdAndActivoTrue(a.idAlumno())
                            .orElseThrow(()-> new ResourceNotFoundException("Uno de los Alumnos no fue encontrado"));

                    Asistencia asistencia = AsistenciaMapper.toEntity(a,curso,alumno, asistente);

                    return asistenciaRepository.save(asistencia);
                        })
                .toList();

        // Recorre las asistencias para asignar las faltas a los ausentes
        asistencias.forEach((a)-> {
            if (a.getEstado() == EstadoAsistencia.AUSENTE || a .getEstado() == EstadoAsistencia.JUSTIFICADO){
                faltasService.registrarFalta(a.getAlumno());
            }
        });
    }

    private void ajustarFaltaPorCambioDeEstado(Alumno alumno, EstadoAsistencia estadoAnterior, EstadoAsistencia estadoNuevo) {

        if (estadoAnterior == estadoNuevo) {
            return;
        }

        boolean contabaComoFalta = estadoAnterior == EstadoAsistencia.AUSENTE;
        boolean cuentaComoFalta = estadoNuevo == EstadoAsistencia.AUSENTE;

        if (contabaComoFalta && !cuentaComoFalta) {
            alumno.setFaltas(Math.max(0, alumno.getFaltas() - 1));
            alumnoRepository.save(alumno);
        } else if (!contabaComoFalta && cuentaComoFalta) {
            faltasService.registrarFalta(alumno);
        }
    }

    @Override
    @Transactional
    public void actualizarEstado(AsistenciaEstadoRequest dto, Long idAsistencia) {

        Asistencia asistencia = asistenciaRepository.findByIdAndEliminadoFalse(idAsistencia)
                .orElseThrow(()-> new ResourceNotFoundException("Asistencia no encontrada"));

        EstadoAsistencia estadoAnterior = asistencia.getEstado();
        EstadoAsistencia estadoNuevo = dto.estado();

        boolean cambioEstado = estadoAnterior != estadoNuevo;
        boolean cambioObservacion = dto.observacion() != null
                && !dto.observacion().equals(asistencia.getObservacion());

        // Para no guardar una asistencia sin modificaciones
        if (!cambioEstado && !cambioObservacion) {
            return;
        }

        if (cambioEstado) {
            asistencia.setEstado(estadoNuevo);
        }
        if (cambioObservacion) {
            asistencia.setObservacion(dto.observacion());
        }
        asistenciaRepository.save(asistencia);

        if (cambioEstado) {
            ajustarFaltaPorCambioDeEstado(asistencia.getAlumno(), estadoAnterior, estadoNuevo);
        }
    }

    @Override
    public void eliminarAsistencia(Long idAsistencia) {
        Asistencia asistencia = asistenciaRepository.findByIdAndEliminadoFalse(idAsistencia)
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no fue encontrada"));

        asistencia.eliminar();

        if (asistencia.getEstado() == EstadoAsistencia.AUSENTE ||
                asistencia.getEstado() == EstadoAsistencia.JUSTIFICADO){

            Alumno alumno = asistencia.getAlumno();

            alumno.setFaltas(alumno.getFaltas() - 1);

            alumnoRepository.save(alumno);
    }

        asistenciaRepository.save(asistencia);
    }

    @Override
    @Transactional
    public void eliminarAsistenciasPorAnio() {

        int anioActual = LocalDate.now().getYear();

        asistenciaRepository.eliminarAsistenciasDeAniosAnteriores(anioActual);

    }

    @Override
    @Transactional
    public List<AsistenciaResponse> getAsistenciasPorFecha(LocalDate fecha, Long idCurso) {

        if(fecha.isAfter(LocalDate.now())){
            throw new BadRequestException("La fecha seleccionada debe ser anterior al actual");
        }

        if (!cursoRepository.existsById(idCurso)){
            throw new ResourceNotFoundException("El curso no fue encontrado");
        }
        List<Asistencia> asistencias = asistenciaRepository.findByCursoIdAndFecha(idCurso, fecha);

        return asistencias.stream()
                .map((a)->{

                    Alumno alumno = a.getAlumno();

                    AlumnoResponse alumnoResponse = AlumnoMapper.toResponse(alumno,alumno.getFaltas(),limites);

                    return AsistenciaMapper.toResponse(a,alumnoResponse);
                })
                .toList();
    }

}
