package com.funstack.backend.dto;

public class GameResponse {
    private boolean success;
    private String message;
    private Object data; // Can hold any specific game data (e.g., dice roll result, chosen item)

    public GameResponse() {}

    public GameResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}
