import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  Dices, 
  HelpCircle, 
  Target, 
  Sparkles, 
  Gamepad2,
  TrendingUp,
  LogOut
} from "lucide-react";

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  gradient: string;
}

const games: GameCard[] = [
  {
    id: "number-guessing",
    title: "Number Guessing",
    description: "Test your intuition and guess the secret number",
    icon: Target,
    path: "/number-guessing",
    gradient: "from-cyan-500 via-blue-500 to-purple-500",
  },
  {
    id: "spin-wheel",
    title: "Spin Wheel",
    description: "Spin the wheel and discover your prize",
    icon: TrendingUp,
    path: "/spin-wheel",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
  {
    id: "dice-battle",
    title: "Dice Battle",
    description: "Roll the dice and compete with your opponent",
    icon: Dices,
    path: "/dice-battle",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: "quick-quiz",
    title: "Quick Quiz",
    description: "Test your knowledge with rapid-fire questions",
    icon: HelpCircle,
    path: "/quick-quiz",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    id: "task-generator",
    title: "Task Generator",
    description: "Get random tasks and challenges to complete",
    icon: Sparkles,
    path: "/task-generator",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
];

import { useNavigate } from "react-router";

export function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="absolute top-0 right-0">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all shadow-xl"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="inline-flex items-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-cyan-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FunStack
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Mini Games & Utility Hub
          </p>
        </motion.div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={game.path}>
                <motion.div
                  whileHover={{ 
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.05,
                    z: 50,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                  }}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Glass card background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl" />
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Shadow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between z-10">
                    <div>
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} p-4 mb-4 shadow-2xl`}
                        style={{ transformStyle: "preserve-3d" }}
                        whileHover={{ rotateZ: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <game.icon className="w-full h-full text-white" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {game.title}
                      </h3>
                      <p className="text-gray-400">
                        {game.description}
                      </p>
                    </div>

                    <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <span className="mr-2">Play Now</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
