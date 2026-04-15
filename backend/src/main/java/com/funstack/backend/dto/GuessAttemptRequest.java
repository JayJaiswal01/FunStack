package com.funstack.backend.dto;

public class GuessAttemptRequest {
    private Long userId;
    private int guess;

    public GuessAttemptRequest() {}

    public GuessAttemptRequest(Long userId, int guess) {
        this.userId = userId;
        this.guess = guess;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getGuess() { return guess; }
    public void setGuess(int guess) { this.guess = guess; }
}
