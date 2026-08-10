package com.example.TrabajoFinal.feature.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Alumno de la institución. Pertenece a un Curso (reasignable en el tiempo).
 */
@Entity
@Table(name = "alumnos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 80)
    private String apellido;

    @Column(nullable = false, unique = true, length = 20)
    private Long dni;

    private LocalDate fechaNacimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;

    /**
     * Baja lógica del alumno.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    /**
     * Cantidad de faltas (inasistencias) acumuladas por el alumno. Se guarda
     * en el propio alumno (en vez de recalcularla siempre desde Asistencia)
     * para poder disparar la baja lógica automática apenas se alcanza el
     * límite configurado, y para poder avisar cuando se está acercando a él.
     */
    @Builder.Default
    @Column(nullable = false)
    private Integer faltas = 0;
}
