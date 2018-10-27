package io.openvidu.classroom.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import io.openvidu.classroom.demo.security.NgrokConfiguration;
import io.openvidu.classroom.demo.security.NgrokController;

@SpringBootApplication
@EnableWebSocket
public class App {
	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(App.class, args);
		NgrokConfiguration ngrokConf = context.getBean(NgrokConfiguration.class);
		if (ngrokConf.getOpenViduPublicUrl().equals("ngrok")) {
			try {
				NgrokController ngrok = new NgrokController();
				System.out.println();
				System.out.println("        PUBLIC IP        ");
				System.out.println("-------------------------");
				System.out.println(ngrok.getNgrokAppUrl());
				System.out.println("-------------------------");
				System.out.println();
			} catch (Exception e) {
				System.out.println("   No ngrok connection   ");
			}
		}
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*").allowedMethods("GET", "POST", "PUT", "DELETE");
				;
			}
		};
	}

}
