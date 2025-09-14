package com.civicflow.civicflow_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CivicflowBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CivicflowBackendApplication.class, args);
	}
}
