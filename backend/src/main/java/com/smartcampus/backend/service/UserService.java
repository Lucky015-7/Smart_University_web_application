package com.smartcampus.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User syncUser(String auth0Id, String name, String email, User.Role role) {
        return userRepository.findById(auth0Id).map(existingUser -> {
            boolean changed = false;

            if (!name.equals(existingUser.getName())) {
                existingUser.setName(name);
                changed = true;
            }
            if (!email.equals(existingUser.getEmail())) {
                existingUser.setEmail(email);
                changed = true;
            }
            if (existingUser.getRole() != role) {
                existingUser.setRole(role);
                changed = true;
            }

            return changed ? userRepository.save(existingUser) : existingUser;
        }).orElseGet(() -> {
            User newUser = new User();
            newUser.setId(auth0Id);
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setRole(role);
            return userRepository.save(newUser);
        });
    }

    public User getUser(String auth0Id) {
        return userRepository.findById(auth0Id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
