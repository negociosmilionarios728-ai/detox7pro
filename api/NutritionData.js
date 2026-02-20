import { nutritionTable } from "./NutritionData.js";

// Peso padrão por alimento (em gramas)
const defaultPortions = {
  arroz: 150,
  feijao: 100,
  frango: 150,
  carne: 150,
  bife: 150,
  macarrao: 200,
  batata: 150,
  salada: 120,
  hamburguer: 200,
  coxinha: 120,
  ovo: 60
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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

    if (normalized.includes(foodName)) {
      const weight = customWeight || defaultPortions[foodName] || 100;

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
    ...total,
    foods: foodsFound,
    totalWeight: foodsFound.reduce((acc, f) => acc + f.weight, 0)
  };
}