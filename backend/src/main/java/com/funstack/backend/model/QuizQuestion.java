package com.funstack.backend.model;

import java.util.List;

public class QuizQuestion {
    private int id;
    private String question;
    private List<String> options;
    private int correctOptionIndex;

    public QuizQuestion() {}

    public QuizQuestion(int id, String question, List<String> options, int correctOptionIndex) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.correctOptionIndex = correctOptionIndex;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }
}
