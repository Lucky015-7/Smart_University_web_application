package com.smartcampus.backend.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListNotificationsResponse {
    private String status;
    private DataContainer data;
    private Map<String, Object> _links;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DataContainer {
        private List<NotificationDTO> items;
    }

}
