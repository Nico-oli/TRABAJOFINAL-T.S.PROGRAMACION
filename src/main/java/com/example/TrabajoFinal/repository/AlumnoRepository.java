package com.example.TrabajoFinal.repository;

import com.example.TrabajoFinal.feature.models.Alumno;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {

    Optional<Alumno> findByDni(Long dni);

    boolean existsByDni(Long dni);

    List<Alumno> findByCursoIdAndActivoTrue(Long cursoId);

    Optional<Alumno> findByIdAndActivoTrue(Long id);

    // Resetea las faltas cuando el Administrador desee
    @Modifying
    @Query("UPDATE Alumno a SET a.faltas = 0")
    void resetearFaltas();

    @Modifying
    @Query("""
    UPDATE Alumno a
    SET a.adicional = false
    WHERE a.adicional = true
""")
    void resetearAdicionales();
}
