package com.back.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// @Configuration
// @EnableWebSocketMessageBroker
// public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
// 	@Override
// 	public void registerStompEndpoints(StompEndpointRegistry stompEndpointRegistry) {
// 		stompEndpointRegistry.addEndpoint("/socket")
// 				.setAllowedOrigins("http://localhost:4200", "https://localhost:4200", "ws://localhost:4200", "wss://localhost:4200", "https://events-system.org", "http://events-system.org", "ws://events-system.org","wss://events-system.org", "wss://events-system-back.wn.r.appspot.com", "ws://events-system-back.wn.r.appspot.com" )
// 				.withSockJS();
// 	}

// 	@Override
// 	public void configureMessageBroker(MessageBrokerRegistry registry) {
// 		registry.enableSimpleBroker("/topic");
// 		registry.setApplicationDestinationPrefixes("/app");
// 	}
// }


// @Configuration
// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

// 	@Override
// 	public void configureMessageBroker(MessageBrokerRegistry config) {
// 		config.enableSimpleBroker("/topic");
// 		config.setApplicationDestinationPrefixes("/app");
// 	}

// 	@Override
// 	public void registerStompEndpoints(StompEndpointRegistry registry) {
// 		registry.addEndpoint("/ws")
// 				.setAllowedOrigins("http://localhost:4200", "https://localhost:4200", "ws://localhost:4200", "wss://localhost:4200")
// 				.withSockJS();
// 	}
// }
