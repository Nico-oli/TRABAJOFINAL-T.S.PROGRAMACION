package com.example.TrabajoFinal.config.exceptions;

import java.util.List;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends CustomException {

    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, List.of());
    }
}
