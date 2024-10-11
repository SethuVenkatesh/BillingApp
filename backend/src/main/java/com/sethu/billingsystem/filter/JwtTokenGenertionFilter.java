package com.sethu.billingsystem.filter;

import com.sethu.billingsystem.constants.ApplicationConstants;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

public class JwtTokenGenertionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null){
            Environment env= getEnvironment();
            if(env!=null){
                String secret = env.getProperty(ApplicationConstants.JWT_SECRET,ApplicationConstants.JWT_DEFAULT_SECRET);
                SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
                String jwt = Jwts.builder().issuer("Billing System").subject("JWT Token")
                        .claim("username",auth.getPrincipal())
                        .claim("authorities",auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                        .issuedAt(new Date(System.currentTimeMillis()))
                        .expiration(new Date(System.currentTimeMillis() + ApplicationConstants.JWT_TOKEN_EXPIRATION))
                        .signWith(secretKey).compact();
                response.setHeader(ApplicationConstants.JWT_HEADER,jwt);
            }
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return !request.getServletPath().endsWith("/auth/api_login");
    }
}
