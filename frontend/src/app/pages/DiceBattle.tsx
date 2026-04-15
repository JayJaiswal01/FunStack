import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Trophy, Swords } from "lucide-react";
import { gameService } from "../../services/api";

export function DiceBattle() {
  const [player1Roll, setPlayer1Roll] = useState<number | null>(null);
  const [player2Roll, setPlayer2Roll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const rollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);
    setWinner(null);

    try {
      const userId = parseInt(localStorage.getItem('userId') || '1');
      const res = await gameService.rollDice(userId);
      const { userRoll, compRoll, winner: winResult } = res.data.data;

      // Simulate rolling animation for 1 second
      let count = 0;
      const interval = setInterval(() => {
        setPlayer1Roll(Math.floor(Math.random() * 6) + 1);
        setPlayer2Roll(Math.floor(Math.random() * 6) + 1);
        count++;

        if (count > 10) {
          clearInterval(interval);
          setPlayer1Roll(userRoll);
          setPlayer2Roll(compRoll);
          setIsRolling(false);
          setWinner(winResult === "User Wins" ? "Player 1" : winResult === "Computer Wins" ? "Player 2" : "Draw");
          
          if (winResult === "User Wins") setPlayer1Score(s => s + 1);
          if (winResult === "Computer Wins") setPlayer2Score(s => s + 1);
        }
      }, 100);
    } catch (err) {
      console.error("Roll failed", err);
      setIsRolling(false);
    }
  };

  const resetGame = () => {
    setPlayer1Roll(null);
    setPlayer2Roll(null);
    setWinner(null);
    setPlayer1Score(0);
    setPlayer2Score(0);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Dice Battle
          </h1>
          <p className="text-xl text-gray-400">
            Roll the dice and defeat your opponent!
          </p>
        </motion.div>

        {/* Score Board */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4">
              <p className="text-cyan-400 font-bold mb-1">Player 1</p>
              <p className="text-4xl font-bold text-white">{player1Score}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Swords className="w-8 h-8 text-gray-500" />
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4">
              <p className="text-emerald-400 font-bold mb-1">Player 2</p>
              <p className="text-4xl font-bold text-white">{player2Score}</p>
            </div>
          </div>
        </motion.div>

        {/* Dice Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Player 1 Dice */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Player 1</h3>
            <DiceDisplay 
              value={player1Roll} 
              isRolling={isRolling}
              isWinner={winner === "Player 1"}
              color="cyan"
            />
          </motion.div>

          {/* Player 2 Dice */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold text-emerald-400 mb-6">Player 2</h3>
            <DiceDisplay 
              value={player2Roll} 
              isRolling={isRolling}
              isWinner={winner === "Player 2"}
              color="emerald"
            />
          </motion.div>
        </div>

        {/* Winner Display */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-3xl blur-xl" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl px-12 py-6">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rollDice}
            disabled={isRolling}
            className={`px-12 py-4 rounded-xl font-bold text-xl shadow-2xl transition-all ${
              isRolling
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:shadow-cyan-500/50"
            }`}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {isRolling ? "Rolling..." : "ROLL DICE"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-8 py-4 rounded-xl font-bold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            Reset Score
          </motion.button>
        </div>
      </div>
    </div>
  );
}

interface DiceDisplayProps {
  value: number | null;
  isRolling: boolean;
  isWinner: boolean;
  color: "cyan" | "emerald";
}

function DiceDisplay({ value, isRolling, isWinner, color }: DiceDisplayProps) {
  const gradientClass = color === "cyan" 
    ? "from-cyan-500 to-blue-500" 
    : "from-emerald-500 to-teal-500";

  return (
    <motion.div
      animate={
        isRolling
          ? {
              rotateX: [0, 360, 720],
              rotateY: [0, 360, 720],
              scale: [1, 1.1, 1],
            }
          : isWinner
          ? {
              y: [-10, 0, -10],
              scale: [1, 1.1, 1],
            }
          : {}
      }
      transition={
        isRolling
          ? { duration: 1, repeat: Infinity, ease: "linear" }
          : isWinner
          ? { duration: 0.6, repeat: Infinity }
          : {}
      }
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative"
    >
      {/* Glow effect for winner */}
      {isWinner && (
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} rounded-3xl blur-2xl opacity-60 scale-110`} />
      )}

      {/* Dice */}
      <div className={`relative w-32 h-32 bg-gradient-to-br ${gradientClass} rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/30`}>
        {value !== null && (
          <div className="grid grid-cols-3 gap-2 p-4">
            {getDotPattern(value).map((dot, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  dot ? "bg-white shadow-lg" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getDotPattern(value: number): boolean[] {
  const patterns: { [key: number]: boolean[] } = {
    1: [false, false, false, false, true, false, false, false, false],
    2: [true, false, false, false, false, false, false, false, true],
    3: [true, false, false, false, true, false, false, false, true],
    4: [true, false, true, false, false, false, true, false, true],
    5: [true, false, true, false, true, false, true, false, true],
    6: [true, false, true, true, false, true, true, false, true],
  };
  return patterns[value] || [];
}
