interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function QuizResults({ score, totalQuestions, onRestart }: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100;

  const getResultMessage = () => {
    if (percentage === 100) return "yo thats insane you got them all";
    if (percentage >= 80) return "ayy look at you go";
    if (percentage >= 60) return "not bad not bad";
    if (percentage >= 40) return "hey at least you tried";
    return "uhh wanna try that again";
  };

  return (
      <div className="win-inset bg-[#ECE9D8] p-4 text-center">
        <h2 className="text-2xl font-bold mb-6 text-[#1553BE]">
          Quiz Complete!
        </h2>

        <div className="mb-8">
          <div className="win-inset bg-white p-4 mb-4">
            <p className="text-4xl font-bold text-[#1553BE]">
              {score} / {totalQuestions}
            </p>
            <p className="text-lg mt-2">
              You scored {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        <button
            onClick={onRestart}
            className="win-button font-bold hover:bg-[#E1DED2] active:bg-[#D6D2C2]"
        >
          {getResultMessage()}
        </button>
      </div>
  );
}
