package com.smartcampus.backend.dto.auth0;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auth0RoleDto {
    private String id;
    private String name;
    private String description;
}
