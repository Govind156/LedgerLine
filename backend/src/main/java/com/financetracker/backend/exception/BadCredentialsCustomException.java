package com.financetracker.backend.exception;

public class BadCredentialsCustomException extends RuntimeException {
    public BadCredentialsCustomException(String message) {
        super(message);
    }
}