package com.back.demo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static com.back.demo.model.Permission.ADMIN_CREATE;
import static com.back.demo.model.Permission.ADMIN_DELETE;
import static com.back.demo.model.Permission.ADMIN_READ;
import static com.back.demo.model.Permission.ADMIN_UPDATE;
import static com.back.demo.model.Permission.MANAGER_CREATE;
import static com.back.demo.model.Permission.MANAGER_DELETE;
import static com.back.demo.model.Permission.MANAGER_READ;
import static com.back.demo.model.Permission.MANAGER_UPDATE;
import static com.back.demo.model.Role.ADMIN;
import static com.back.demo.model.Role.MANAGER;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.config.Customizer.withDefaults;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {
            "/api/v1/auth/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/api/events/**",       // Ensure all event-related endpoints are accessible
            "/api/feedback/**",    // Ensure all feedback-related endpoints are accessible
            "/api/event-rsvps/**", // Ensure all event-rsvp-related endpoints are accessible
            "/api/employees/**",   // Ensure all employee-related endpoints are accessible
            "/api/socialclubs/**", // Ensure all social-club-related endpoints are accessible
            "/api/notifications/**", // Ensure all notification-related endpoints are accessible
            "/api/eventseries/**", // Ensure all event-series-related endpoints are accessible
            "/api/eventseriessubscriptions/**", // Ensure all event-series-subscription-related endpoints are accessible
            "/api/reset/**", // Ensure all password-reset-related endpoints are accessible
            "/api/user-analytics/**", // Ensure all user-analytics-related endpoints are accessible
            "/api/user-analytics", // Ensure all user-analytics-related endpoints are accessible
            "/api/dialogflow/**", // Ensure all chatbot-related endpoints are accessible
            "/api/dialogflow/detectIntent", // Ensure all chatbot-related endpoints are accessible
            "/api/**",
            "https://events-system.org/events",
            "/socket/**",
            "/api/reset/**",
            "/notify",
            "/test-redis-connection",
            "events/employee/165/upcoming-events"
    };

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(corsConfigurer -> {
                CorsConfigurationSource source = request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOriginPatterns(List.of("http://*", "https://*"));
                    config.setAllowedMethods(List.of("*"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                };
                corsConfigurer.configurationSource(source);
            })
            .authorizeHttpRequests(req ->
                req.requestMatchers(WHITE_LIST_URL)
                    .permitAll()
                    .requestMatchers("/api/v1/management/**").hasAnyRole(ADMIN.name(), MANAGER.name())
                    .requestMatchers(GET, "/api/v1/management/**").hasAnyAuthority(ADMIN_READ.name(), MANAGER_READ.name())
                    .requestMatchers(POST, "/api/v1/management/**").hasAnyAuthority(ADMIN_CREATE.name(), MANAGER_CREATE.name())
                    .requestMatchers(PUT, "/api/v1/management/**").hasAnyAuthority(ADMIN_UPDATE.name(), MANAGER_UPDATE.name())
                    .requestMatchers(DELETE, "/api/v1/management/**").hasAnyAuthority(ADMIN_DELETE.name(), MANAGER_DELETE.name())
                    .anyRequest()
                    .authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .logout(logout ->
                logout.logoutUrl("/api/v1/auth/logout")
                    .addLogoutHandler(logoutHandler)
                    .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
            )
            .headers(headers -> headers
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                    .preload(true)
                )
                .contentSecurityPolicy(policyConfig -> 
                    policyConfig.policyDirectives("default-src 'self'; script-src 'self' https://trusted-scripts.com"))
                .permissionsPolicy(policy -> policy.policy("geolocation=(self), microphone=()"))
            );

        return http.build();
    }

    @Bean
    public OidcUserService customOidcUserService() {
        return new OidcUserService() {
            private final OidcUserService delegate = new OidcUserService();

            @Override
            public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
                OidcUser oidcUser = delegate.loadUser(userRequest);

                Set<GrantedAuthority> mappedAuthorities = oidcUser.getAuthorities().stream()
                    .map(authority -> {
                        if (authority instanceof OidcUserAuthority) {
                            OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                            OidcIdToken idToken = oidcUserAuthority.getIdToken();
                            OidcUserInfo userInfo = oidcUserAuthority.getUserInfo();

                            // Map the claims found in idToken and/or userInfo to one or more GrantedAuthority's and add it to mappedAuthorities

                        }
                        return authority;
                    })
                    .collect(Collectors.toSet());

                // Create a new OidcUser with the mapped authorities
                return new DefaultOidcUser(mappedAuthorities, oidcUser.getIdToken(), oidcUser.getUserInfo());
            }
        };
    }
}
