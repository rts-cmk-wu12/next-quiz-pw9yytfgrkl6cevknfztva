import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/config/QuizCategoryFetcher';
import { QuizSettings } from '@/types/QuizInterfaceDefinitions';
import { TriviaCategory } from '@/types/TriviaCategoriesInterfaces';
import { createSlug } from '@/utils/slugUtils';

interface QuizSetupProps {
  onStart: (settings: QuizSettings) => void;
}

export default function QuizSetup({ onStart }: QuizSetupProps) {
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<QuizSettings>({
    category: 9,
    difficulty: 'medium',
    amount: 5
  });

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      setIsLoading(false);
    };

    loadCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(settings);
  };

  if (isLoading) {
    return (
        <div className="win-inset bg-[#ECE9D8] p-4">
          <div className="win-inset bg-white p-4">
            Loading categories...
          </div>
        </div>
    );
  }

  return (
      <div className="win-inset bg-[#ECE9D8] p-4">
        <h2 className="text-2xl font-bold mb-6 text-[#1553BE]">
          Quiz Settings
        </h2>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-bold text-sm">
              Category:
            </label>
            <select
                className="w-full win-inset bg-white p-2"
                value={settings.category}
                onChange={(e) => setSettings({...settings, category: Number(e.target.value)})}
            >
              {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-sm">
              Difficulty:
            </label>
            <select
                className="w-full win-inset bg-white p-2"
                value={settings.difficulty}
                onChange={(e) => setSettings({...settings, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-sm">
              Number of Questions:
            </label>
            <input
                type="number"
                min="1"
                max="50"
                className="w-full win-inset bg-white p-2"
                value={settings.amount}
                onChange={(e) => setSettings({...settings, amount: Number(e.target.value)})}
            />
          </div>

          <button
              type="submit"
              className="win-button w-full text-center font-bold hover:bg-[#E1DED2] active:bg-[#D6D2C2]"
          >
            Start Quiz
          </button>
        </form>
        <div className="mt-8 win-inset bg-white p-4">
          <h3 className="text-lg font-bold mb-4">Quick Start Quizzes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.slice(0, 6).map((category) => {
              const quickSettings: QuizSettings = {
                category: category.id,
                difficulty: 'medium',
                amount: 10
              };
              const slug = createSlug(quickSettings, categories);

              return (
                  <Link
                      key={category.id}
                      href={`/quiz/${slug}`}
                      className="win-outset bg-win-bg  p-2 text-center hover:bg-[#E1DED2]"
                  >
                    {category.name}
                    <span className="block text-sm text-gray-600">
                  10 Questions - Medium
                </span>
                  </Link>
              );
            })}
          </div>
        </div>
      </div>
  );
}
