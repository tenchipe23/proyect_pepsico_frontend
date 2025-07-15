package com.pepsico.vehicleexitpass.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class RequestLoggingFilter implements Filter {
    
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Inicialización si es necesaria
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        log.info("Request: {} {}", req.getMethod(), req.getRequestURI());
        chain.doFilter(request, response);
    }
    
    @Override
    public void destroy() {
        // Limpieza si es necesaria
    }
}
