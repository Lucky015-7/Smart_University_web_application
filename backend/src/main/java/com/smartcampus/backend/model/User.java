package com.smartcampus.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Users") // Explicitly capitalized to match MS SQL exactly
public class User {

    @Id
    @Column(name = "Id", length = 50) // Explicitly constrained to VARCHAR(50)
    private String id; // Auth0 ID: "google-oauth2|104..."

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false, length = 20)
    private Role role;

    // @Column(name = "CreatedAt", insertable = false, updatable = false)
    // private java.time.LocalDateTime createdAt; // Native handled by SQL DEFAULT GETDATE()

    public enum Role {
        USER, ADMIN, TECHNICIAN
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    // public java.time.LocalDateTime getCreatedAt() {
    //     return createdAt;
    // }
}