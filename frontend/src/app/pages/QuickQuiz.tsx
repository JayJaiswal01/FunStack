import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctOptionIndex: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOptionIndex: 1,
  },
  {
    id: 3,
    question: "What is 15 × 8?",
    options: ["110", "120", "130", "140"],
    correctOptionIndex: 1,
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"],
    correctOptionIndex: 2,
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctOptionIndex: 3,
  },
];

import { useEffect } from "react";
import { gameService } from "../../services/api";

export function QuickQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameService.getQuizQuestions().then(res => {
      setQuestions(res.data);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load questions", err);
      setLoading(false);
    });
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setShowResult(true);

    if (index === questions[currentQuestion].correctOptionIndex) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const userId = parseInt(localStorage.getItem('userId') || '1');
        // Submit final score to backend
        gameService.submitQuiz(userId, {}).catch(console.error); 
        setGameOver(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameOver(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>;
  if (!questions.length) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">No questions found.</div>;

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Header */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Quick Quiz
          </h1>
          <p className="text-xl text-gray-400">
            Test your knowledge with rapid-fire questions
          </p>
        </motion.div>

        {!gameOver ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: 10 }}
                transition={{ duration: 0.5 }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }}
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl" />
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
                    <h2 className="text-2xl font-bold text-white text-center">
                      {question.question}
                    </h2>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4">
                  {question.options.map((option, index) => {
                    const isCorrect = index === question.correctOptionIndex;
                    const isSelected = index === selectedAnswer;
                    const showCorrect = showResult && isCorrect;
                    const showWrong = showResult && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        whileHover={
                          selectedAnswer === null
                            ? { 
                                scale: 1.02, 
                                rotateX: 3,
                                rotateY: 3,
                              }
                            : {}
                        }
                        whileTap={{ scale: 0.98 }}
                        style={{
                          transformStyle: "preserve-3d",
                          perspective: 1000,
                        }}
                        className={`relative p-6 rounded-2xl font-bold text-lg transition-all ${
                          showCorrect
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : showWrong
                            ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                            : "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 text-white hover:border-orange-400/50"
                        }`}
                      >
                        {/* Shadow for correct/wrong */}
                        {(showCorrect || showWrong) && (
                          <div className={`absolute inset-0 ${
                            showCorrect ? "bg-green-500/30" : "bg-red-500/30"
                          } rounded-2xl blur-xl -z-10`} />
                        )}

                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          )}
                          {showWrong && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <XCircle className="w-6 h-6" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          /* Game Over Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Quiz Complete!
                </h2>
                <p className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {score} / {questions.length}
                </p>
                <p className="text-xl text-gray-400">
                  {score === questions.length
                    ? "Perfect Score! 🎉"
                    : score >= questions.length / 2
                    ? "Great Job! 👏"
                    : "Keep Practicing! 💪"}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
              className="px-12 py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-2xl hover:shadow-orange-500/50"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
