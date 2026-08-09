package com.example.TrabajoFinal.repository;

import com.example.TrabajoFinal.feature.models.Asistencia;
import com.example.TrabajoFinal.feature.models.EstadoAsistencia;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByCursoIdAndFecha(Long cursoId, LocalDate fecha);

    List<Asistencia> findByAlumnoId(Long alumnoId);

    Optional<Asistencia> findByAlumnoIdAndFecha(Long alumnoId, LocalDate fecha);

    long countByAlumnoIdAndEstado(Long alumnoId, EstadoAsistencia estado);
}
