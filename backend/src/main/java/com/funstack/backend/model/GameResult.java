package com.funstack.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_results")
public class GameResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String gameType; // e.g., "GUESSING", "SPIN", "DICE", "QUIZ"

    private String result; // win/lose, selected item, or score
    
    private Integer score; // optional, mainly for dice/quiz

    private LocalDateTime timestamp;

    public GameResult() {}

    public GameResult(Long id, Long userId, String gameType, String result, Integer score, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.gameType = gameType;
        this.result = result;
        this.score = score;
        this.timestamp = timestamp;
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGameType() { return gameType; }
    public void setGameType(String gameType) { this.gameType = gameType; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
