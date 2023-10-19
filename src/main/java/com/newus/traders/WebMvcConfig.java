package com.newus.traders;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private final long MAX_AGE_SECS = 3600;
   

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
        // Origin이 http:localhost:3000에 대해
		.allowedOrigins("http://localhost:3000")
        .allowedOriginPatterns("/**")
        .allowedMethods("/","GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("**")
        .allowedHeaders("http://localhost:3000")
        .allowCredentials(true)
        .maxAge(MAX_AGE_SECS);

    }
}