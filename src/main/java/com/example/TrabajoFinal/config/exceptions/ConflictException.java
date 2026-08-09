package com.example.TrabajoFinal.config.exceptions;

import java.util.List;
import org.springframework.http.HttpStatus;

public class ConflictException extends CustomException {

    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT, List.of());
    }
}
