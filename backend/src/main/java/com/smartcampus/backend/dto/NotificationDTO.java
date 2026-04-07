package com.smartcampus.backend.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private String id;
    private String type;
    private String title;
    private String message;
    private String referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;
    private Map<String, Object> _links;

}
