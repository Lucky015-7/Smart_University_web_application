package com.smartcampus.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Compact ticket representation used in GET /api/tickets (list view).
 * Does NOT include comments or full description to keep the payload small.
 * Full detail (with comments) is available via GET /api/tickets/{id}.
 */
public class TicketListItem {

    private String id;
    private ResourceInfo resource;
    private String location;
    private String category;
    private String priority;
    private String status;
    private String createdBy;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonProperty("_links")
    private Map<String, Object> links = new HashMap<>();

    public static class ResourceInfo {
        private String id;
        private String name;

        public ResourceInfo() {}

        public ResourceInfo(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // ── Constructor ───────────────────────────────────────────────────────────

    public TicketListItem() {}

    public TicketListItem(String id, ResourceInfo resource, String location,
                          String category, String priority, String status,
                          String createdBy, String assignedTo,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id         = id;
        this.resource   = resource;
        this.location   = location;
        this.category   = category;
        this.priority   = priority;
        this.status     = status;
        this.createdBy  = createdBy;
        this.assignedTo = assignedTo;
        this.createdAt  = createdAt;
        this.updatedAt  = updatedAt;
    }

    public void addLink(String rel, Map<String, String> link) {
        this.links.put(rel, link);
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public ResourceInfo getResource() { return resource; }
    public void setResource(ResourceInfo resource) { this.resource = resource; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Map<String, Object> getLinks() { return links; }
    public void setLinks(Map<String, Object> links) { this.links = links; }
}