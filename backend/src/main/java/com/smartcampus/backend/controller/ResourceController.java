package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(@RequestBody CreateResourceRequest request) {
        try {
            ResourceResponse resource = resourceService.createResource(request);
            
            ApiResponse<ResourceResponse> response = new ApiResponse<>("success", resource);
            response.addLink("self", createLink("/api/resources/" + resource.getId()));
            response.addLink("bookings", createLink("/api/bookings?resourceId=" + resource.getId()));
            response.addLink("tickets", createLink("/api/tickets?resourceId=" + resource.getId()));
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/api/resources/" + resource.getId())
                .header("Cache-Control", "no-store")
                .body(response);
                
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("error", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", null));
        }
    }

    private Map<String, String> createLink(String href) {
        Map<String, String> link = new HashMap<>();
        link.put("href", href);
        return link;
    }
}
