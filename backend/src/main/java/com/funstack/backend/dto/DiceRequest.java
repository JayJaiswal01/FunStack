package com.funstack.backend.dto;

public class DiceRequest {
    private Long userId;

    public DiceRequest() {}

    public DiceRequest(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
