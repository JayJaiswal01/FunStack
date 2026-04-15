import { createBrowserRouter, Navigate } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { NumberGuessing } from "./pages/NumberGuessing";
import { SpinWheel } from "./pages/SpinWheel";
import { DiceBattle } from "./pages/DiceBattle";
import { QuickQuiz } from "./pages/QuickQuiz";
import { TaskGenerator } from "./pages/TaskGenerator";
import { GameModeSelection } from "./pages/GameModeSelection";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/number-guessing",
    element: <ProtectedRoute><GameModeSelection /></ProtectedRoute>,
  },
  {
    path: "/number-guessing/:mode",
    element: <ProtectedRoute><NumberGuessing /></ProtectedRoute>,
  },
  {
    path: "/spin-wheel",
    element: <ProtectedRoute><SpinWheel /></ProtectedRoute>,
  },
  {
    path: "/dice-battle",
    element: <ProtectedRoute><DiceBattle /></ProtectedRoute>,
  },
  {
    path: "/quick-quiz",
    element: <ProtectedRoute><QuickQuiz /></ProtectedRoute>,
  },
  {
    path: "/task-generator",
    element: <ProtectedRoute><TaskGenerator /></ProtectedRoute>,
  },
]);
