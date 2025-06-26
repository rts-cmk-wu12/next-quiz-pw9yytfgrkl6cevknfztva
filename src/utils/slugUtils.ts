import {TriviaCategory} from "@/types/TriviaCategoriesInterfaces";
import {QuizSettings} from "@/types/QuizInterfaceDefinitions";


/**
 * Parses a URL slug into quiz settings.
 * Extracts category, difficulty, and amount from the slug string.
 * Returns null if parsing fails or if the data is invalid.
 *
 * @param slug - The URL slug string to parse.
 * @param categories - List of available categories to match against.
 * @returns QuizSettings object if parsing is successful, otherwise null.
 */


export function parseSlug(slug: string, categories: TriviaCategory[]): QuizSettings | null {
  try {
    const parts = slug.split('-');
    if (parts.length < 3) return null;

    const amountRaw = parts.pop()!;
    const difficulty = parts.pop()!;
    const categorySlug = parts.join('-');

    const category = categories.find(c =>
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categorySlug
    );

    if (!category) return null;

    const amount = parseInt(amountRaw, 10);
    if (isNaN(amount) || amount <= 0) return null;

    return {
      category: category.id,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      amount
    };
  } catch {
    return null;
  }
}

/**
 * Generates a URL slug from quiz settings and categories.
 * Encodes category name, difficulty, and question amount into a URL-friendly string.
 *
 * @param settings - The quiz configuration parameters.
 * @param categories - List of available categories for name lookup.
 * @returns A URL slug string representing the quiz settings.
 */

export function createSlug(settings: QuizSettings, categories: TriviaCategory[]): string {
  const category = categories.find(c => c.id === settings.category);
  const categorySlug = category ?
      category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') :
      'general';

  return `${categorySlug}-${settings.difficulty}-${settings.amount}`;
}

