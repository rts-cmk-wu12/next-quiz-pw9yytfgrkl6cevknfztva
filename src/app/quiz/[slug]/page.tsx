'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { parseSlug } from '@/utils/slugUtils';
import { getCategories } from '@/config/QuizCategoryFetcher';
import QuizGame from '@/components/QuizGameComponent';
import QuizResults from '@/components/QuizResultsComponent';
import { QuizQuestion } from '@/types/QuizInterfaceDefinitions';
import {shuffleArray} from "@/utils/ArrayShuffleUtility";

const QuizPage = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [gameState, setGameState] = useState<'loading' | 'playing' | 'results'>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Missing slug');
      return;
    }

    const initQuiz = async () => {
      try {
        const fetchedCategories = await getCategories();
        const settings = parseSlug(slug, fetchedCategories);
        if (!settings) return notFound();

        const url = `https://opentdb.com/api.php?amount=${settings.amount}&category=${settings.category}&difficulty=${settings.difficulty}&type=multiple`;

        const maxRetries = 5;
        let retries = 0;
        let questionsFetched = false;

        while (retries < maxRetries && !questionsFetched) {
          const response = await fetch(url);
          const data = await response.json();
          if (data?.response_code === 0 && data?.results?.length > 0) {
            const formattedQuestions: QuizQuestion[] = data.results.map((q: QuizQuestion) => ({
              ...q,
              all_answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            }));
            setQuestions(formattedQuestions);
            setGameState('playing');
            questionsFetched = true;
            break;
          } else {
            retries++;
            if (retries >= maxRetries) {
              throw new Error('No questions found after multiple attempts. Please refresh.');
            }
            await new Promise(res => setTimeout(res, 1000));
          }
        }
      } catch (err) {
        console.error('Quiz loading error:', err);
        setError('Failed to load quiz. Please try again later.');
      }
    };

    initQuiz();
  }, [slug]);

  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState('results');
  };

  if (error) {
    return (
        <div className="min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            <div className="win-inset bg-[#ECE9D8] p-4">
              <div className="win-inset bg-white p-4 text-red-500">{error}</div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen p-4 flex items-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-[#1553BE] win-outset text-white p-2 flex items-center">
            <span className="text-xl font-bold">Loader.exe</span>
          </div>
          <div className="win-outset bg-[#ECE9D8] p-4">
            {gameState === 'loading' && (
                <div className="win-inset bg-white p-4">Loading quiz...</div>
            )}
            {gameState === 'playing' && questions.length > 0 && (
                <div className="animate-slideIn">
                  <QuizGame questions={questions} onComplete={handleGameComplete} />
                </div>
            )}
            {gameState === 'results' && (
                <div className="animate-bounceIn">
                  <QuizResults
                      score={score}
                      totalQuestions={questions.length}
                      onRestart={() => (window.location.href = '/')} // handle restart
                  />
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default QuizPage;