import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { User, Users, ArrowLeft } from "lucide-react";

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const modes: GameMode[] = [
  {
    id: "computer",
    title: "User vs Computer",
    description: "Challenge the AI in an epic battle",
    icon: User,
    gradient: "from-cyan-500 via-blue-500 to-purple-500",
  },
  {
    id: "player",
    title: "User1 vs User2",
    description: "Compete with a friend locally",
    icon: Users,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
];

export function GameModeSelection() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setTimeout(() => {
      navigate(`/number-guessing/${modeId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Back button */}
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Select Game Mode
          </h1>
          <p className="text-xl text-gray-400">
            Choose your opponent and start the challenge
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              onClick={() => handleModeSelect(mode.id)}
            >
              <motion.div
                whileHover={{
                  rotateX: 8,
                  rotateY: 8,
                  scale: 1.05,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                animate={selectedMode === mode.id ? { 
                  scale: 1.1,
                  rotateX: 0,
                  rotateY: 0,
                  z: 100,
                } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1200,
                }}
                className="relative h-80 rounded-3xl overflow-hidden cursor-pointer group"
              >
                {/* Glass background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl" />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Selected state */}
                {selectedMode === mode.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-40`}
                  />
                )}

                {/* Glow effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-br ${mode.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`}
                  animate={selectedMode === mode.id ? { opacity: 0.7 } : {}}
                />

                {/* Content */}
                <div className="relative h-full p-10 flex flex-col items-center justify-center text-center z-10">
                  <motion.div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${mode.gradient} p-6 mb-6 shadow-2xl`}
                    whileHover={{ rotateZ: 15, scale: 1.1 }}
                    style={{ transformStyle: "preserve-3d" }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <mode.icon className="w-full h-full text-white" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white mb-4">
                    {mode.title}
                  </h2>
                  <p className="text-lg text-gray-300">
                    {mode.description}
                  </p>

                  <motion.div
                    className="mt-8 px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select Mode
                  </motion.div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
