const tabelaAlimentos = require("./nutritionTable");

// 🔍 Busca inteligente (aceita nome parcial)
function encontrarAlimento(nomePrato) {
  const nome = nomePrato.toLowerCase().trim();

  // 1️⃣ Busca exata
  if (tabelaAlimentos[nome]) {
    return tabelaAlimentos[nome];
  }

  // 2️⃣ Busca parcial (ex: "coxinha" encontra "coxinha de frango")
  const chaveEncontrada = Object.keys(tabelaAlimentos).find(alimento =>
    alimento.includes(nome)
  );

  if (chaveEncontrada) {
    return tabelaAlimentos[chaveEncontrada];
  }

  return null;
}

// 🧮 Função principal de cálculo
function calcularNutricao(nomePrato, pesoInformado = null) {

  const alimento = encontrarAlimento(nomePrato);

  // ❌ Caso não encontre
  if (!alimento) {
    return {
      erro: "Alimento não encontrado na base interna."
    };
  }

  // Se usuário não informar peso → usa peso padrão
  const pesoFinal = pesoInformado || alimento.pesoPadrao;

  // Fator proporcional
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

module.exports = calcularNutricao;
