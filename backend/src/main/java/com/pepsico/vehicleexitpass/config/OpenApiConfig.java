package com.pepsico.vehicleexitpass.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Sistema de Pases de Salida - PepsiCo")
                        .description("API para gestionar los pases de salida de vehículos en las instalaciones de PepsiCo")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo PepsiCo")
                                .email("soporte@pepsico.com")
                                .url("https://www.pepsico.com"))
                        .license(new License()
                                .name("Licencia PepsiCo")
                                .url("https://www.pepsico.com/license")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}