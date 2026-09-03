// src/services/openFoodFactsService.js
const BASE_URL = 'https://br.openfoodfacts.org/cgi/search.pl';

export async function searchFoods(query, { pageSize = 20 } = {}) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    search_terms: query.trim(),
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: String(pageSize),
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Open Food Facts respondeu com status ${response.status}`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.products)) {
    throw new Error('Formato de resposta inesperado da API Open Food Facts');
  }

  return data.products
    .filter((product) => product.product_name)
    .map((product) => normalizeProduct(product));
}

function normalizeProduct(product) {
  const nutriments = product.nutriments || {};

  return {
    id: product.code || product._id || crypto.randomUUID(),
    name: product.product_name || 'Produto sem nome',
    brand: product.brands || 'Marca não informada',
    kcal: parseNutrient(nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal']),
    protein: parseNutrient(nutriments['proteins_100g']),
    carbs: parseNutrient(nutriments['carbohydrates_100g']),
    fat: parseNutrient(nutriments['fat_100g']),
    servingSize: product.serving_size || '100g',
  };
}

function parseNutrient(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 10) / 10 : null;
}