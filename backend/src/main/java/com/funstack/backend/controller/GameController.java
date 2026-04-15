package com.funstack.backend.controller;

import com.funstack.backend.dto.*;
import com.funstack.backend.model.QuizQuestion;
import com.funstack.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/game")
public class GameController {

    @Autowired
    private GameService gameService;

    // --- Number Guessing Game ---
    @PostMapping("/guess/start")
    public ResponseEntity<GameResponse> startGuessing(@RequestBody MapRequest request) {
        return ResponseEntity.ok(gameService.startGuessingGame(request.getUserId()));
    }

    @PostMapping("/guess/attempt")
    public ResponseEntity<GameResponse> attemptGuess(@RequestBody GuessAttemptRequest request) {
        return ResponseEntity.ok(gameService.attemptGuess(request));
    }

    // --- Random Picker / Spin Wheel ---
    @PostMapping("/spin")
    public ResponseEntity<GameResponse> spinWheel(@RequestBody SpinRequest request) {
        return ResponseEntity.ok(gameService.spinWheel(request));
    }

    // --- Dice Battle Game ---
    @PostMapping("/dice")
    public ResponseEntity<GameResponse> rollDice(@RequestBody DiceRequest request) {
        return ResponseEntity.ok(gameService.rollDice(request));
    }

    // --- Quick Quiz Game ---
    @GetMapping("/quiz/questions")
    public ResponseEntity<List<QuizQuestion>> getQuestions() {
        return ResponseEntity.ok(gameService.getQuizQuestions());
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<GameResponse> submitQuiz(@RequestBody QuizSubmitRequest request) {
        return ResponseEntity.ok(gameService.submitQuiz(request));
    }

    // --- Random Task Generator ---
    @GetMapping("/task/random")
    public ResponseEntity<GameResponse> getRandomTask(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(gameService.getRandomTask(category));
    }

    // Static inner class for simple ID requests (avoiding too many DTO files)
    public static class MapRequest {
        private Long userId;
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }
}
