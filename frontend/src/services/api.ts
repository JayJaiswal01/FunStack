import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const gameService = {
  // Number Guessing
  startGuessing: (userId: number) => api.post('/game/guess/start', { userId }),
  attemptGuess: (userId: number, guess: number) => api.post('/game/guess/attempt', { userId, guess }),

  // Spin Wheel
  spinWheel: (userId: number, items: string[]) => api.post('/game/spin', { userId, items }),

  // Dice Battle
  rollDice: (userId: number) => api.post('/game/dice', { userId }),

  // Quick Quiz
  getQuizQuestions: () => api.get('/game/quiz/questions'),
  submitQuiz: (userId: number, answers: any) => api.post('/game/quiz/submit', { userId, answers }),

  // Random Task
  getRandomTask: (category?: string) => api.get(`/game/task/random${category ? `?category=${category}` : ''}`),
};

export default api;
