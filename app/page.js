"use client";

import { useEffect, useState } from "react";

const TOTAL_QUESTIONS = 60;
const MAX_TIME = 360; // 6 minutes in seconds
const ADMIN_PASSWORD = "admin123"; // Change this to your desired password

// Generate medium-level math questions
const generateQuestions = () => {
  const ops = ["+", "-", "*", "/"];
  let questions = [];

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 30) + 5;
    const op = ops[Math.floor(Math.random() * ops.length)];

    let answer;
    if (op === "+") answer = a + b;
    if (op === "-") answer = a - b;
    if (op === "*") answer = a * b;
    if (op === "/") answer = a * b;

    questions.push({
      question: `${a} ${op} ${b}`,
      answer,
    });
  }

  return questions.sort(() => Math.random() - 0.5);
};

export default function SprintMathGame() {
  const [questions, setQuestions] = useState(() => generateQuestions());
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      setPassword("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setIndex(0);
    setScore(0);
    setInput("");
    setTime(0);
    setFinished(false);
    setQuestions(generateQuestions());
  };

  const resetGame = () => {
    setGameStarted(false);
    setIndex(0);
    setScore(0);
    setInput("");
    setTime(0);
    setFinished(false);
    setShowModal(false);
  };

  // Prevent reload while game is playing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (gameStarted && !finished) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [gameStarted, finished]);

  // Timer
  useEffect(() => {
    if (finished || !mounted || !gameStarted) return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t >= MAX_TIME) {
          setFinished(true);
          setShowModal(true);
          return t;
        }
        return t + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finished, mounted, gameStarted]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
        <div className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            ⚡ Sprint Math Challenge
          </h1>
          <div className="text-center text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // Password Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            Admin Access Required
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Enter the admin password to start the game
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-lg text-black text-lg outline-none bg-white"
            />
            {passwordError && (
              <p className="text-red-500 text-center text-sm">
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Start Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
        <div className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-6">
            ⚡ Sprint Math Challenge
          </h1>
          <div className="space-y-4 mb-8 text-center">
            <p className="text-xl">
              Answer {TOTAL_QUESTIONS} math questions as fast as you can!
            </p>
            <p className="text-gray-400">
              Maximum time: {MAX_TIME / 60} minutes
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-300">
              <li>✓ {TOTAL_QUESTIONS} questions to solve</li>
              <li>
                ✓ Mix of addition, subtraction, multiplication, and division
              </li>
              <li>✓ Track your score and time</li>
              <li>✓ Beat your best time!</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="w-full px-8 py-4 bg-green-500 hover:bg-green-600 rounded-lg text-2xl font-bold transition transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
      {/* Completion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 border-green-500">
            <h2 className="text-3xl font-bold text-center mb-4 text-green-400">
              🎉 Game Completed!
            </h2>
            <div className="space-y-3 mb-6">
              <p className="text-2xl text-center">
                Score:{" "}
                <span className="font-bold text-yellow-400">{score}</span> /{" "}
                {TOTAL_QUESTIONS}
              </p>
              <p className="text-2xl text-center">
                Time:{" "}
                <span className="font-bold text-blue-400">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
              </p>
              <p className="text-lg text-center text-gray-300">
                Accuracy: {((score / TOTAL_QUESTIONS) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          ⚡ Sprint Math Challenge
        </h1>

        <div className="flex justify-between mb-4 text-lg">
          <span>
            Question: {index + 1} / {TOTAL_QUESTIONS}
          </span>
          <span>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        {!finished ? (
          <>
            {questions.length > 0 && (
              <div className="text-center text-4xl font-bold mb-6">
                {questions[index].question}
              </div>
            )}

            <div className="w-full">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-lg text-black text-xl outline-none bg-white"
                placeholder="Your answer"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
