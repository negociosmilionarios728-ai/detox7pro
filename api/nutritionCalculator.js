// api/nutritionCalculator.js

import tabelaAlimentos from "./nutritionTable.js";

// 🔍 Busca inteligente (exata + parcial)
function encontrarAlimento(nomePrato) {
  const nome = nomePrato.toLowerCase().trim();

  // Busca exata
  if (tabelaAlimentos[nome]) {
    return tabelaAlimentos[nome];
  }

  // Busca parcial
  const chaveEncontrada = Object.keys(tabelaAlimentos).find(alimento =>
    alimento.includes(nome)
  );

  if (chaveEncontrada) {
    return tabelaAlimentos[chaveEncontrada];
  }

  return null;
}

// 🧮 Cálculo nutricional
function calcularNutricao(nomePrato, pesoInformado = null) {

  const alimento = encontrarAlimento(nomePrato);

  if (!alimento) {
    return {
      erro: "Alimento não encontrado na base interna."
    };
  }

  const pesoFinal = pesoInformado || alimento.pesoPadrao;
  const fator = pesoFinal / 100;

  return {
    nome: nomePrato,
    peso: pesoFinal,
    calorias: Math.round(alimento.calorias100g * fator),
    proteinas: Math.round(alimento.proteina100g * fator),
    carboidratos: Math.round(alimento.carbo100g * fator),
    gorduras: Math.round(alimento.gordura100g * fator),
    fibras: Math.round(alimento.fibra100g * fator)
  };
}

export default calcularNutricao;
