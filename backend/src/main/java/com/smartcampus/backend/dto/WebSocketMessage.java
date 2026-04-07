package com.smartcampus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebSocketMessage {
    private String action;
    private String messageType;
    private NotificationDTO data;
    private String userId;
    private long timestamp;

}
