package com.example.TrabajoFinal.repository;

import com.example.TrabajoFinal.feature.models.Asistencia;
import com.example.TrabajoFinal.feature.models.EstadoAsistencia;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByCursoIdAndFecha(Long cursoId, LocalDate fecha);

    List<Asistencia> findByAlumnoId(Long alumnoId);

    List<Asistencia> findByAlumnoIdOrderByFechaDesc(Long alumnoId);

    Optional<Asistencia> findByAlumnoIdAndFecha(Long alumnoId, LocalDate fecha);

    long countByAlumnoIdAndEstado(Long alumnoId, EstadoAsistencia estado);

    /**
     * Cuenta, en una única consulta agregada, las inasistencias (AUSENTE) de
     * todos los alumnos de un curso. Evita hacer una query por alumno (N+1)
     * cuando se listan los alumnos de un curso.
     */
    @Query("SELECT a.alumno.id AS alumnoId, COUNT(a) AS cantidad " +
            "FROM Asistencia a " +
            "WHERE a.alumno.curso.id = :idCurso AND a.estado = com.example.TrabajoFinal.feature.models.EstadoAsistencia.AUSENTE " +
            "GROUP BY a.alumno.id")
    List<InasistenciasPorAlumno> countAusenciasPorCurso(@Param("idCurso") Long idCurso);

    interface InasistenciasPorAlumno {
        Long getAlumnoId();
        Long getCantidad();
    }
}
