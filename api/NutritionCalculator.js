import { tabelaAlimentos } from "./NutritionData.js";

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

  for (const nome in tabelaAlimentos) {
    const normalizedFood = normalize(nome);

    if (normalized.includes(normalizedFood)) {
      const alimento = tabelaAlimentos[nome];

      const peso = customWeight || alimento.pesoPadrao;
      const multiplicador = peso / 100;

      total.calories += alimento.calorias100g * multiplicador;
      total.protein += alimento.proteina100g * multiplicador;
      total.carbs += alimento.carbo100g * multiplicador;
      total.fat += alimento.gordura100g * multiplicador;
      total.fiber += alimento.fibra100g * multiplicador;

      foodsFound.push({
        name: nome,
        weight: peso
      });
    }
  }

  if (foodsFound.length === 0) return null;

  return {
    ...total,
    foods: foodsFound,
    totalWeight: foodsFound.reduce((acc, f) => acc + f.weight, 0)
  };
}