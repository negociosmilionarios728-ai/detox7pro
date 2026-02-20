import { nutritionTable } from './nutritionTable.js';

// ==============================
// Normalizador de texto
// ==============================
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ==============================
// Calculador principal
// ==============================
export function calculateMeal(description, customWeight) {
  if (!description) return null;

  const normalizedDescription = normalizeText(description);

  let total = {
    nome: description,
    peso: 0,
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    fibras: 0
  };

  let encontrou = false;

  for (const food of nutritionTable) {
    const normalizedFoodName = normalizeText(food.name);

    if (normalizedDescription.includes(normalizedFoodName)) {
      encontrou = true;

      const weight = customWeight || food.defaultWeight || 100;
      const multiplier = weight / 100;

      total.peso += weight;
      total.calorias += food.calories * multiplier;
      total.proteinas += food.protein * multiplier;
      total.carboidratos += food.carbs * multiplier;
      total.gorduras += food.fat * multiplier;
      total.fibras += food.fiber * multiplier;
    }
  }

  if (!encontrou) return null;

  // Arredondamento final
  total.calorias = Math.round(total.calorias);
  total.proteinas = Number(total.proteinas.toFixed(1));
  total.carboidratos = Number(total.carboidratos.toFixed(1));
  total.gorduras = Number(total.gorduras.toFixed(1));
  total.fibras = Number(total.fibras.toFixed(1));

  return total;
}