package com.civicflow.civicflow_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // enable CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()                    // public register/login
                        .requestMatchers("/api/files/**").permitAll()                   // public file access (images)
                        .requestMatchers("/uploads/**").permitAll()                     // public access to uploaded files
                        .requestMatchers(HttpMethod.GET, "/api/user/profile/{username}").permitAll() // public user profiles
                        .requestMatchers(HttpMethod.GET, "/api/issues").permitAll()     // public GET all issues
                        .requestMatchers(HttpMethod.GET, "/api/issues/{id}").permitAll() // public GET single issue
                        .requestMatchers(HttpMethod.GET, "/api/issues/filter").permitAll() // public GET smart filtering
                        .requestMatchers(HttpMethod.GET, "/api/issues/nearby").permitAll() // public GET nearby issues
                        .requestMatchers(HttpMethod.GET, "/api/issues/nearby/**").permitAll() // public GET nearby filtered issues
                        .requestMatchers(HttpMethod.GET, "/api/issues/{id}/distance").permitAll() // public GET distance calculation
                        .requestMatchers(HttpMethod.GET, "/api/issues/{id}/votes/**").permitAll() // public GET vote summaries and votes
                        .requestMatchers(HttpMethod.GET, "/api/issues/{id}/votes").permitAll() // public GET all votes for issue
                        .anyRequest().authenticated()                                   // ALL OTHER endpoints require auth
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Unauthorized");
                        })
                );

        // Add JWT filter before Spring Security's username/password auth
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Allow all origins in development
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
