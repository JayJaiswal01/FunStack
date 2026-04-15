package com.funstack.backend.service;

import com.funstack.backend.dto.*;
import com.funstack.backend.model.GameResult;
import com.funstack.backend.model.QuizQuestion;
import com.funstack.backend.repository.GameResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    @Autowired
    private GameResultRepository gameResultRepository;

    // In-memory storage for active guessing games (Key: userId, Value: targetNumber)
    private final Map<Long, Integer> activeGuessingGames = new ConcurrentHashMap<>();

    // Static list of quiz questions
    private final List<QuizQuestion> quizQuestions = Arrays.asList(
            new QuizQuestion(1, "What is the capital of France?", Arrays.asList("London", "Berlin", "Paris", "Madrid"), 2),
            new QuizQuestion(2, "Which planet is known as the Red Planet?", Arrays.asList("Earth", "Mars", "Jupiter", "Venus"), 1),
            new QuizQuestion(3, "What is 5 + 7?", Arrays.asList("10", "11", "12", "13"), 2),
            new QuizQuestion(4, "Who wrote 'Romeo and Juliet'?", Arrays.asList("Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"), 1),
            new QuizQuestion(5, "What is the largest ocean on Earth?", Arrays.asList("Atlantic", "Indian", "Arctic", "Pacific"), 3)
    );

    // Static list of random tasks
    private final Map<String, List<String>> tasksByCategory = new HashMap<>() {{
        put("Fun", Arrays.asList("Do a 10-second silly dance", "Tell a joke", "Sing a song chorus", "Make a funny face"));
        put("Fitness", Arrays.asList("Do 5 pushups", "Hold a plank for 20 seconds", "Do 10 jumping jacks", "Stretch for 1 minute"));
        put("Study", Arrays.asList("Read 1 page of a book", "Solve a quick math problem", "Write 3 things you learned today", "Organize your desk for 2 minutes"));
    }};

    // --- Number Guessing Game ---
    public GameResponse startGuessingGame(Long userId) {
        int targetNumber = new Random().nextInt(100) + 1; // 1-100
        activeGuessingGames.put(userId, targetNumber);
        return new GameResponse(true, "Game started! Guess a number between 1 and 100.", null);
    }

    public GameResponse attemptGuess(GuessAttemptRequest request) {
        Integer target = activeGuessingGames.get(request.getUserId());
        if (target == null) {
            return new GameResponse(false, "No active game for this user. Please start a new game.", null);
        }

        int guess = request.getGuess();
        if (guess < target) {
            return new GameResponse(true, "Too Low", "low");
        } else if (guess > target) {
            return new GameResponse(true, "Too High", "high");
        } else {
            activeGuessingGames.remove(request.getUserId());
            saveResult(request.getUserId(), "GUESSING", "Win", 1);
            return new GameResponse(true, "Correct! You guessed it.", "correct");
        }
    }

    // --- Random Picker / Spin Wheel ---
    public GameResponse spinWheel(SpinRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return new GameResponse(false, "Item list cannot be empty", null);
        }

        int index = new Random().nextInt(request.getItems().size());
        String selected = request.getItems().get(index);

        saveResult(request.getUserId(), "SPIN", selected, null);
        return new GameResponse(true, "Spin complete", selected);
    }

    // --- Dice Battle Game ---
    public GameResponse rollDice(DiceRequest request) {
        Random random = new Random();
        int userRoll = random.nextInt(6) + 1;
        int compRoll = random.nextInt(6) + 1;

        String result;
        int score = 0;
        if (userRoll > compRoll) {
            result = "User Wins";
            score = 1;
        } else if (compRoll > userRoll) {
            result = "Computer Wins";
            score = 0;
        } else {
            result = "Draw";
            score = 0;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("userRoll", userRoll);
        data.put("compRoll", compRoll);
        data.put("winner", result);

        saveResult(request.getUserId(), "DICE", result, score);
        return new GameResponse(true, "Dice rolled", data);
    }

    // --- Quick Quiz Game ---
    public List<QuizQuestion> getQuizQuestions() {
        return quizQuestions;
    }

    public GameResponse submitQuiz(QuizSubmitRequest request) {
        int score = 0;
        for (QuizQuestion q : quizQuestions) {
            Integer userAns = request.getAnswers().get(q.getId());
            if (userAns != null && userAns == q.getCorrectOptionIndex()) {
                score++;
            }
        }

        saveResult(request.getUserId(), "QUIZ", "Score: " + score + "/" + quizQuestions.size(), score);
        return new GameResponse(true, "Quiz submitted", score);
    }

    // --- Random Task Generator ---
    public GameResponse getRandomTask(String category) {
        List<String> tasks;
        if (category != null && tasksByCategory.containsKey(category)) {
            tasks = tasksByCategory.get(category);
        } else {
            // Pick from all categories if none specified or invalid
            tasks = new ArrayList<>();
            for (List<String> list : tasksByCategory.values()) {
                tasks.addAll(list);
            }
        }

        String task = tasks.get(new Random().nextInt(tasks.size()));
        return new GameResponse(true, "Task generated", task);
    }

    // --- Helper to save results ---
    private void saveResult(Long userId, String type, String result, Integer score) {
        if (userId != null) {
            GameResult gameResult = new GameResult();
            gameResult.setUserId(userId);
            gameResult.setGameType(type);
            gameResult.setResult(result);
            gameResult.setScore(score);
            gameResultRepository.save(gameResult);
        }
    }
}
