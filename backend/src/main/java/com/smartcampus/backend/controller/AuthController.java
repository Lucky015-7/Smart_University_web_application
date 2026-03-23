package com.smartcampus.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    // Called by frontend after very first login (Now safely protected by Auth0 validation!)
    @PostMapping("/register")
    public ResponseEntity<?> register(@AuthenticationPrincipal Jwt jwt){
        String auth0Id = jwt.getSubject();

        // Try standard claims first, then custom namespace
        // String name = jwt.getClaimAsString("name");
        // if (name == null) {
        //     name = jwt.getClaimAsString("https://smartcampus.api/name");
        // }
        // String email = jwt.getClaimAsString("email");
        // if (email == null) {
        //     email = jwt.getClaimAsString("https://smartcampus.api/email");
        // }

        // CORRECTION: Read standard Profile traits explicitly from the mapped custom namespace 
        String name = jwt.getClaimAsString("https://smartcampus.api/name");
        String email = jwt.getClaimAsString("https://smartcampus.api/email");

        // Failsafe 
        if(name == null) name = "Unknown User";
        if(email == null) email = "unknown@university.edu";

        User user = userService.syncUser(auth0Id, name, email); //if user not in the db this add the user


        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", Map.of(
                "id",    user.getId(),
                "name",  user.getName(),
                "email", user.getEmail(),
                "role",  user.getRole()
            ),
            "_links", Map.of(
                "self",    Map.of("href", "/api/auth/register"),
                "profile", Map.of("href", "/api/auth/me")
            )
        ));
    }


    // Get current logged-in user profile
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.getUser(jwt.getSubject());

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", Map.of(
                "id",    user.getId(),
                "name",  user.getName(),
                "email", user.getEmail(),
                "role",  user.getRole()
            )
        ));
    }
    

}
