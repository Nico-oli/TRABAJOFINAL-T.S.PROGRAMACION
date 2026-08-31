package com.example.TrabajoFinal;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TrabajoFinalApplication {

	public static void main(String[] args) {
		cargarVariablesDeEntorno();
		SpringApplication.run(TrabajoFinalApplication.class, args);
	}

	private static void cargarVariablesDeEntorno() {
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(entry -> {
			if (System.getenv(entry.getKey()) == null && System.getProperty(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});
	}
}
