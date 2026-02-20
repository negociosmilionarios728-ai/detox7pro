import { nutritionTable } from './NutritionTable.js'

// ===== FUNÇÃO NORMALIZE =====
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ===== FUNÇÃO PRINCIPAL =====
export function calculateMeal(description, customWeight) {
  if (!description) return null;

  const normalized = normalize(description);

  let total = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  };

  let foodsFound = [];

  for (const food of nutritionTable) {
    const foodName = normalize(food.name);

    const foodWords = foodName
      .split(" ")
      .filter(word => word.length > 2);

    const match = foodWords.some(word =>
      normalized.includes(word)
    );

    if (match) {
      const weight = customWeight || food.defaultWeight || 100;
      const multiplier = weight / 100;

      total.calories += food.calories * multiplier;
      total.protein += food.protein * multiplier;
      total.carbs += food.carbs * multiplier;
      total.fat += food.fat * multiplier;
      total.fiber += food.fiber * multiplier;

      foodsFound.push({
        name: food.name,
        weight
      });
    }
  }

  if (foodsFound.length === 0) {
    return null;
  }

  return {
    calories: Math.round(total.calories),
    protein: Math.round(total.protein),
    carbs: Math.round(total.carbs),
    fat: Math.round(total.fat * 100) / 100,
    fiber: Math.round(total.fiber),
    foods: foodsFound,
    totalWeight: foodsFound.reduce((acc, f) => acc + f.weight, 0)
  };
}