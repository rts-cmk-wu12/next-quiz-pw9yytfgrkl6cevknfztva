import {TriviaCategoriesResponse} from "@/types/TriviaCategoriesInterfaces";

export async function getCategories() {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data: TriviaCategoriesResponse = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}