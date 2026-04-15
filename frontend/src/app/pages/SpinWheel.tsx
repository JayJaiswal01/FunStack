import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

const prizes = [
  { id: 1, label: "100 Points", color: "#06b6d4", textColor: "#fff" },
  { id: 2, label: "50 Points", color: "#a855f7", textColor: "#fff" },
  { id: 3, label: "500 Points", color: "#ec4899", textColor: "#fff" },
  { id: 4, label: "25 Points", color: "#8b5cf6", textColor: "#fff" },
  { id: 5, label: "250 Points", color: "#06b6d4", textColor: "#fff" },
  { id: 6, label: "75 Points", color: "#f97316", textColor: "#fff" },
  { id: 7, label: "1000 Points", color: "#10b981", textColor: "#fff" },
  { id: 8, label: "Try Again", color: "#ef4444", textColor: "#fff" },
];

import { gameService } from "../../services/api";

export function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spinWheel = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    try {
      const items = prizes.map(p => p.label);
      const userId = parseInt(localStorage.getItem('userId') || '1');
      const res = await gameService.spinWheel(userId, items);
      const selectedLabel = res.data.data;

      const spins = 5 + Math.random() * 5; // 5-10 full rotations
      
      // Calculate final rotation to land on the correct segment
      const selectedIndex = prizes.findIndex(p => p.label === selectedLabel);
      const segmentAngle = 360 / prizes.length;
      const targetDegree = 360 - (selectedIndex * segmentAngle);
      
      const totalRotation = rotation + (spins * 360) + targetDegree - (rotation % 360);

      setRotation(totalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setResult(selectedLabel);
      }, 4000);
    } catch (err) {
      console.error("Spin failed", err);
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
            Spin the Wheel
          </h1>
          <p className="text-xl text-gray-400">
            Test your luck and win amazing prizes!
          </p>
        </motion.div>

        {/* Wheel Container */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-12"
          >
            {/* Wheel shadow/glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-rose-500/30 rounded-full blur-3xl scale-110" />

            {/* Pointer */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg" 
                style={{ filter: "drop-shadow(0 4px 20px rgba(250, 204, 21, 0.6))" }}
              />
            </motion.div>

            {/* Wheel */}
            <div className="relative w-[500px] h-[500px]">
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Wheel segments */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {prizes.map((prize, index) => {
                    const angle = (360 / prizes.length) * index;
                    const nextAngle = (360 / prizes.length) * (index + 1);
                    
                    const x1 = 100 + 95 * Math.cos((angle * Math.PI) / 180);
                    const y1 = 100 + 95 * Math.sin((angle * Math.PI) / 180);
                    const x2 = 100 + 95 * Math.cos((nextAngle * Math.PI) / 180);
                    const y2 = 100 + 95 * Math.sin((nextAngle * Math.PI) / 180);

                    const textAngle = angle + 360 / prizes.length / 2;
                    const textX = 100 + 65 * Math.cos((textAngle * Math.PI) / 180);
                    const textY = 100 + 65 * Math.sin((textAngle * Math.PI) / 180);

                    return (
                      <g key={prize.id}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`}
                          fill={prize.color}
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill={prize.textColor}
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                        >
                          {prize.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Center hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-2xl flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Spin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-12 py-4 rounded-full font-bold text-xl shadow-2xl transition-all ${
              isSpinning
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:shadow-pink-500/50"
            }`}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {isSpinning ? "Spinning..." : "SPIN THE WHEEL"}
          </motion.button>

          {/* Result Display */}
          <AnimatePresence>
            {result && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mt-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl" />
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
                    <p className="text-gray-300 mb-2">You won:</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      {result}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
