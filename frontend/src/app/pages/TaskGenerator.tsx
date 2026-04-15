import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";

const tasks = [
  "Do 20 push-ups right now",
  "Write a thank you message to someone",
  "Drink a full glass of water",
  "Take a 5-minute walk outside",
  "Call a friend or family member",
  "Organize your desk or workspace",
  "Practice deep breathing for 3 minutes",
  "Read 10 pages of a book",
  "Stretch for 5 minutes",
  "Write down 3 things you're grateful for",
  "Learn a new word in a foreign language",
  "Do 30 jumping jacks",
  "Compliment someone genuinely",
  "Take a 2-minute cold shower",
  "Meditate for 5 minutes",
  "Delete 10 old photos from your phone",
  "Draw or doodle for 5 minutes",
  "Make your bed perfectly",
  "Listen to an inspiring podcast episode",
  "Do a random act of kindness",
];

import { gameService } from "../../services/api";

export function TaskGenerator() {
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTask = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    // Flip to back
    setIsFlipped(false);
    
    try {
      const res = await gameService.getRandomTask();
      const randomTask = res.data.data;

      setTimeout(() => {
        setCurrentTask(randomTask);
        
        // Flip to front
        setTimeout(() => {
          setIsFlipped(true);
          setIsGenerating(false);
        }, 300);
      }, 300);
    } catch (err) {
      console.error("Task generation failed", err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" />
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
            Task Generator
          </h1>
          <p className="text-xl text-gray-400">
            Get random challenges to complete and grow
          </p>
        </motion.div>

        {/* Task Card */}
        <div className="flex justify-center mb-12">
          <div className="perspective-1000 w-full max-w-xl">
            <motion.div
              style={{
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateY: isFlipped ? 0 : 180,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative h-96"
            >
              {/* Back of card (shown when flipped to back) */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0"
              >
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                  <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-20 h-20 text-violet-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-2xl text-white font-bold">
                        Generating Task...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Front of card (shown when flipped to front) */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                }}
                className="absolute inset-0"
              >
                <motion.div
                  whileHover={{
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.02,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  className="relative h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-xl" />
                  <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full animate-shimmer" />
                    
                    <div className="relative h-full p-12 flex flex-col items-center justify-center">
                      <AnimatePresence mode="wait">
                        {currentTask ? (
                          <motion.div
                            key={currentTask}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                          >
                            <Sparkles className="w-16 h-16 text-violet-400 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-4">
                              Your Challenge
                            </h2>
                            <p className="text-2xl text-gray-300 leading-relaxed">
                              {currentTask}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                          >
                            <Sparkles className="w-20 h-20 text-violet-400 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-4">
                              Ready for a Challenge?
                            </h2>
                            <p className="text-xl text-gray-400">
                              Click the button below to generate a random task
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateTask}
            disabled={isGenerating}
            className={`px-12 py-4 rounded-xl font-bold text-xl shadow-2xl transition-all flex items-center gap-3 ${
              isGenerating
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white hover:shadow-violet-500/50"
            }`}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              animate={isGenerating ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-6 h-6" />
            </motion.div>
            {currentTask ? "Generate New Task" : "Generate Task"}
          </motion.button>
        </div>

        {/* Instructions */}
        {currentTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-4">
                <p className="text-gray-400">
                  💡 Complete this task and come back for a new challenge!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
