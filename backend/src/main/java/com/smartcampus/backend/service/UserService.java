package com.smartcampus.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User syncUser(String auth0Id, String name, String email) {
        return userRepository.findById(auth0Id).orElseGet(() -> {
            User newUser = new User();
            newUser.setId(auth0Id);
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setRole(User.Role.USER);
            return userRepository.save(newUser);
        });
    }

    public User getUser(String auth0Id) {
        return userRepository.findById(auth0Id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
