
/**
 * Interface for TriviaCategory
 * @interface TriviaCategory
 * @property {number} id - The category ID for the quiz
 * @property {name} name - TriviaCategory name of category.
 */

export interface TriviaCategory {
  id: number;
  name: string;
}


/**
 * Interface for TriviaCategoriesResponse
 * @interface TriviaCategoriesResponse
 * @property {Array} trivia_categories - An Array with the TriviaCategory id, name.
 */
export interface TriviaCategoriesResponse {
  trivia_categories: TriviaCategory[];
}
