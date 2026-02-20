export const nutritionTable = Object.entries(tabelaAlimentos).map(
  ([name, data]) => ({
    name,
    calories: data.calorias100g,
    protein: data.proteina100g,
    carbs: data.carbo100g,
    fat: data.gordura100g,
    fiber: data.fibra100g,
    defaultWeight: data.pesoPadrao
  })
);
