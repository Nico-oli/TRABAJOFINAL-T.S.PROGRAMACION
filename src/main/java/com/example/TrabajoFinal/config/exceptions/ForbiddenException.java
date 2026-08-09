package com.example.TrabajoFinal.config.exceptions;

import java.util.List;
import org.springframework.http.HttpStatus;

public class ForbiddenException extends CustomException {

    public ForbiddenException(String message) {
        super(message, HttpStatus.FORBIDDEN, List.of());
    }
}
