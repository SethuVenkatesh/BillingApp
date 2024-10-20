package com.sethu.billingsystem.advice;

import com.sethu.billingsystem.model.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class CustomBasicAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        String message = (authException != null && authException.getMessage() != null) ? authException.getMessage()
                : "Unauthorized";
        response.setHeader("error-reason", "Authentication failed");response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");

        // Construct the JSON response
        String jsonResponse =
                String.format("{\"status\": %b,\"message\": \"%s\", \"data\": %s }",
                        false,message, null);
        response.getWriter().write(String.valueOf(jsonResponse));

    }
}
