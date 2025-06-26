/**
 * Randomly shuffles the elements of an array using the Fisher-Yates (Knuth) shuffle algorithm.
 *
 * This implementation:
 * 1. Creates a copy of the input array to avoid mutating the original
 * 2. Iterates through the array from end to start
 * 3. For each position, swaps the current element with a random element from the remaining unshuffled portion
 * 4. Returns the new shuffled array
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The input array to be shuffled
 * @returns {T[]} A new array containing the same elements in randomized order
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(numbers);
 * // shuffled might/could be [3, 1, 5, 2, 4]
 */

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}