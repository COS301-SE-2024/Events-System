package com.back.demo.auth;

import lombok.Data;

@Data
public class OAuth2Response {
    private String given_name;
    private String family_name;
    private String email;
    private String picture;
    private String refresh_token;
}
