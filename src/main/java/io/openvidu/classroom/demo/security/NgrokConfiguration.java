package io.openvidu.classroom.demo.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NgrokConfiguration {

	@Value("${openvidu.publicurl}")
	private String openviduPublicUrl; // local, ngrok, FINAL_URL

	public String getOpenViduPublicUrl() {
		return this.openviduPublicUrl;
	}

}
