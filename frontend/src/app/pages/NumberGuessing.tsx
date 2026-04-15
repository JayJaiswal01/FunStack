import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Trophy, AlertCircle } from "lucide-react";
import { gameService } from "../../services/api";

export function NumberGuessing() {
  const { mode } = useParams();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      setMessage(`Time's up!`);
    }
  }, [timeLeft, isRunning, gameOver]);

  const resetGame = async () => {
    try {
      const userId = parseInt(localStorage.getItem('userId') || '1');
      await gameService.startGuessing(userId);
      setGuess("");
      setAttempts(0);
      setMessage("");
      setGameOver(false);
      setTimeLeft(60);
      setIsRunning(true);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  };

  const handleGuess = async () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage("Please enter a number between 1 and 100");
      return;
    }

    try {
      const userId = parseInt(localStorage.getItem('userId') || '1');
      const res = await gameService.attemptGuess(userId, guessNum);
      const feedback = res.data.data; // "low", "high", "correct"

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (feedback === "correct") {
        setGameOver(true);
        setMessage(`🎉 Correct! You won in ${newAttempts} attempts!`);
        setIsRunning(false);
      } else if (feedback === "low") {
        setMessage("📈 Too low! Try a higher number");
      } else if (feedback === "high") {
        setMessage("📉 Too high! Try a lower number");
      }
    } catch (err) {
      console.error("Guess failed", err);
    }

    setGuess("");
  };

  const progress = ((60 - timeLeft) / 60) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Header */}
        <Link to="/number-guessing">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Number Guessing Game
          </h1>
          <p className="text-gray-400">
            {mode === "computer" ? "You vs Computer" : "Player 1 vs Player 2"}
          </p>
        </motion.div>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <h3 className="text-center text-gray-300 mb-6">Time Left</h3>
                
                {/* 3D Circular Timer */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{timeLeft}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">Attempts</p>
                  <p className="text-2xl font-bold text-cyan-400">{attempts}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Game Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              whileHover={{ rotateX: 2, rotateY: 2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Guess a number between 1 and 100
                </h2>

                {/* Message Display */}
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-6 p-4 rounded-xl backdrop-blur-sm flex items-center gap-3 ${
                        gameOver
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                          : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      }`}
                    >
                      {gameOver ? (
                        <Trophy className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-purple-400" />
                      )}
                      <p className="text-white">{message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!gameOver ? (
                  <div className="space-y-4">
                    <input
                      type="number"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleGuess()}
                      placeholder="Enter your guess"
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-center text-2xl"
                      disabled={gameOver}
                      min="1"
                      max="100"
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGuess}
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      Submit Guess
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-bold shadow-lg shadow-green-500/50"
                  >
                    Play Again
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
