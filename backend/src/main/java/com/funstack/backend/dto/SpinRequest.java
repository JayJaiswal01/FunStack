package com.funstack.backend.dto;

import java.util.List;

public class SpinRequest {
    private Long userId;
    private List<String> items;

    public SpinRequest() {}

    public SpinRequest(Long userId, List<String> items) {
        this.userId = userId;
        this.items = items;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<String> getItems() { return items; }
    public void setItems(List<String> items) { this.items = items; }
}
