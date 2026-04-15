package com.funstack.backend.dto;

import java.util.Map;

public class QuizSubmitRequest {
    private Long userId;
    // Map of question ID to the chosen option index
    private Map<Integer, Integer> answers; 

    public QuizSubmitRequest() {}

    public QuizSubmitRequest(Long userId, Map<Integer, Integer> answers) {
        this.userId = userId;
        this.answers = answers;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Map<Integer, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<Integer, Integer> answers) { this.answers = answers; }
}
