package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/*
 * REST Controller for Resource Management API.
 * Implements Module A endpoints:
 * - GET /api/resources - List resources with filtering
 * - GET /api/resources/{id} - Get resource details
 * - POST /api/resources - Create resource
 * - PUT /api/resources/{id} - Update resource
 * - DELETE /api/resources/{id} - Delete resource
 * 
 * Follows REST architectural constraints with HATEOAS links and proper HTTP semantics.
 */

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;

        /**
     * GET /api/resources
     * List resources with optional filtering and pagination.
     * 
     * Query Parameters:
     * - type: Filter by type (ROOM, LAB, EQUIPMENT)
     * - status: Filter by status (ACTIVE, OUT_OF_SERVICE)
     * - minCapacity: Filter by minimum capacity
     * - page: Page number (1-indexed), default 1
     * - limit: Items per page, default 10
     * 
     * Status Codes:
     * - 200 OK: Successfully retrieved resources
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ListResourcesResponse>> listResources(
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "status", required = false) String status,
        @RequestParam(value = "minCapacity", required = false) Integer minCapacity,
        @RequestParam(value = "page", defaultValue = "1") int page,
        @RequestParam(value = "limit", defaultValue = "10") int limit) {
        
        try {
            ListResourcesResponse resources = resourceService.listResources(type, status, minCapacity, page, limit);
            
            // Build response with HATEOAS links
            ApiResponse<ListResourcesResponse> response = new ApiResponse<>("success", resources);
            
            // Self link
            String queryString = buildQueryString(type, status, minCapacity, resources.getPage(), limit);
            response.addLink("self", createLink("/api/resources" + queryString));
            
            // Next link (if not on last page)
            if (resources.getTotalPages() > 0 && resources.getPage() < resources.getTotalPages()) {
                String nextQuery = buildQueryString(type, status, minCapacity, resources.getPage() + 1, limit);
                response.addLink("next", createLink("/api/resources" + nextQuery));
            }
            
            // Previous link (if not on first page)
            if (resources.getPage() > 1) {
                String prevQuery = buildQueryString(type, status, minCapacity, resources.getPage() - 1, limit);
                response.addLink("prev", createLink("/api/resources" + prevQuery));
            }
            
            return ResponseEntity
                .ok()
                .header("Cache-Control", "public, max-age=300")
                .body(response);
                
        } catch (IllegalArgumentException e) {
            ApiResponse<ListResourcesResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            ApiResponse<ListResourcesResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResource(@PathVariable String id) {
        try {
            ResourceResponse resource = resourceService.getResource(id);
            
            // Build response with HATEOAS links
            ApiResponse<ResourceResponse> response = new ApiResponse<>("success", resource);
            response.addLink("self", createLink("/api/resources/" + resource.getId()));
            response.addLink("bookings", createLink("/api/bookings?resourceId=" + resource.getId()));
            response.addLink("tickets", createLink("/api/tickets?resourceId=" + resource.getId()));
            
            return ResponseEntity
                .ok()
                .header("Cache-Control", "public, max-age=300")
                .body(response);
                
        } catch (NoSuchElementException e) {
            ApiResponse<ResourceResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<ResourceResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(
        @PathVariable String id,
        @RequestBody UpdateResourceRequest request) {
        
        try {
            ResourceResponse resource = resourceService.updateResource(id, request);
            
            // Build response with HATEOAS links
            ApiResponse<ResourceResponse> response = new ApiResponse<>("success", resource);
            response.addLink("self", createLink("/api/resources/" + resource.getId()));
            response.addLink("bookings", createLink("/api/bookings?resourceId=" + resource.getId()));
            response.addLink("tickets", createLink("/api/tickets?resourceId=" + resource.getId()));
            
            return ResponseEntity
                .ok()
                .header("Cache-Control", "no-store")
                .body(response);
                
        } catch (NoSuchElementException e) {
            ApiResponse<ResourceResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (IllegalArgumentException e) {
            ApiResponse<ResourceResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            ApiResponse<ResourceResponse> error = new ApiResponse<>("error", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Map<String, String> createLink(String href) {
        Map<String, String> link = new HashMap<>();
        link.put("href", href);
        return link;
    }

        /**
     * Helper to build query string for pagination.
     */
    private String buildQueryString(String type, String status, Integer minCapacity, int page, int limit) {
        StringBuilder sb = new StringBuilder("?");
        boolean first = true;
        
        if (type != null && !type.isEmpty()) {
            sb.append("type=").append(type);
            first = false;
        }
        
        if (status != null && !status.isEmpty()) {
            if (!first) sb.append("&");
            sb.append("status=").append(status);
            first = false;
        }
        
        if (minCapacity != null) {
            if (!first) sb.append("&");
            sb.append("minCapacity=").append(minCapacity);
            first = false;
        }
        
        if (!first) sb.append("&");
        sb.append("page=").append(page).append("&limit=").append(limit);
        
        return sb.toString();
    }
}



