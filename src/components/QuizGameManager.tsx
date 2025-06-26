'use client';

import { useState } from 'react';
import QuizSetup from '@/components/QuizSetupComponent';
import QuizGame from '@/components/QuizGameComponent';
import QuizResults from '@/components/QuizResultsComponent';
import { shuffleArray } from '@/utils/ArrayShuffleUtility';
import { QuizSettings, QuizQuestion } from '@/types/QuizInterfaceDefinitions';

export default function Home() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startQuiz = async (quizSettings: QuizSettings) => {
    setIsLoading(true);
    setSettings(quizSettings);
    try {
      const response = await fetch(
          `https://opentdb.com/api.php?amount=${quizSettings.amount}&category=${quizSettings.category}&difficulty=${quizSettings.difficulty}&type=multiple`
      );
      const data = await response.json();

      const formattedQuestions = data.results.map((q: QuizQuestion) => ({
        ...q,
        all_answers: shuffleArray([...q.incorrect_answers, q.correct_answer])
      }));

      setQuestions(formattedQuestions);
      setGameState('playing');
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState('results');
  };

  const restartQuiz = () => {
    setGameState('setup');
    setQuestions([]);
    setScore(0);
  };

  return (
      <div className="min-h-screen flex items-center p-4">
        <div className="max-w-4xl  w-full mx-auto">
          <div className="bg-[#1553BE] text-white p-2 flex items-center">
            <span className="text-xl font-bold">Quiz Starter.exe</span>
          </div>
          <div className="win-outset bg-[#ECE9D8] p-4">
            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="win-inset bg-white p-4">
                    Loading questions...
                  </div>
                </div>
            ) : (
                <>
                  {gameState === 'setup' && (
                      <div className="animate-fadeIn">
                        <QuizSetup onStart={startQuiz} />
                      </div>
                  )}

                  {gameState === 'playing' && questions.length > 0 && (
                      <div className="animate-slideIn">
                        <QuizGame
                            questions={questions}
                            onComplete={handleGameComplete}
                        />
                      </div>
                  )}

                  {gameState === 'results' && (
                      <div className="animate-bounceIn">
                        <QuizResults
                            score={score}
                            totalQuestions={questions.length}
                            onRestart={restartQuiz}
                        />
                      </div>
                  )}
                </>
            )}
          </div>
        </div>
      </div>
  );
}
