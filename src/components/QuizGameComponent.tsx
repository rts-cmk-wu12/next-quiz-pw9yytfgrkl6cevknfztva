import { useState } from 'react';
import { QuizQuestion } from '@/types/QuizInterfaceDefinitions';

interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export default function QuizGame({ questions, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [processing, setProcessing] = useState(false); // added

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || processing) return; // prevent rapid clicks
    setProcessing(true);
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestion].correct_answer) {
      setScore(prev => prev + 1); // safe update
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setProcessing(false);
      } else {
        onComplete(score + (answer === questions[currentQuestion].correct_answer ? 1 : 0));
      }
    }, 1500);
  };

  const getAnswerButtonClass = (answer: string) => {
    if (!isAnswered) {
      return 'win-button hover:bg-[#E1DED2]';
    }
    if (answer === questions[currentQuestion].correct_answer) {
      return 'bg-[#90EE90] border-2 border-[#008000]';
    }
    if (answer === selectedAnswer) {
      return 'bg-[#FFB6C1] border-2 border-[#FF0000]';
    }
    return 'win-button opacity-50';
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
      <div className="win-inset bg-[#ECE9D8] p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </span>
            <span className="font-bold text-sm">Score: {score}</span>
          </div>
          <div className="win-inset bg-white h-4">
            <div
                className="h-full bg-[#1553BE] transition-all duration-500"
                style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="win-inset bg-white p-4 mb-4">
            <h2 className="text-lg font-bold">{decodeHtml(questions[currentQuestion].question)}</h2>
          </div>

          <div className="space-y-2">
            {questions[currentQuestion].all_answers.map((answer, index) => (
                <button
                    key={index}
                    className={`w-full text-left p-2 ${getAnswerButtonClass(answer)}`}
                    onClick={() => handleAnswerSelect(answer)}
                    disabled={isAnswered || processing}
                >
                  {decodeHtml(answer)}
                </button>
            ))}
          </div>
        </div>
      </div>
  );
}