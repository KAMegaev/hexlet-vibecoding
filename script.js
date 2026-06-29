'use strict';

/**
 * Базовый обмен веществ (BMR) по формуле Миффлина — Сан Жеора.
 * @param {('male'|'female')} gender
 * @param {number} weight вес, кг
 * @param {number} height рост, см
 * @param {number} age возраст, лет
 * @returns {number} ккал/сутки
 */
function calculateBmr(gender, weight, height, age) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * Распределение белков, жиров и углеводов (40% У / 30% Б / 30% Ж).
 * @param {number} calories суточная норма, ккал
 * @returns {{protein: number, fat: number, carbs: number}} граммы
 */
function calculateMacros(calories) {
  return {
    protein: Math.round((calories * 0.3) / 4),
    fat: Math.round((calories * 0.3) / 9),
    carbs: Math.round((calories * 0.4) / 4),
  };
}

const form = document.getElementById('calc-form');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  resultEl.hidden = true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const gender = data.get('gender');
  const age = Number(data.get('age'));
  const weight = Number(data.get('weight'));
  const height = Number(data.get('height'));
  const activity = Number(data.get('activity'));
  const goal = Number(data.get('goal'));

  if (!age || !weight || !height) {
    showError('Заполните возраст, вес и рост.');
    return;
  }
  if (age < 10 || age > 120 || weight < 20 || weight > 400 || height < 100 || height > 250) {
    showError('Проверьте значения: они выходят за разумные пределы.');
    return;
  }

  const bmr = calculateBmr(gender, weight, height, age);
  const tdee = bmr * activity;
  const goalCalories = tdee * goal;
  const macros = calculateMacros(goalCalories);

  document.getElementById('bmr').textContent = Math.round(bmr);
  document.getElementById('tdee').textContent = Math.round(tdee);
  document.getElementById('goal-calories').textContent = Math.round(goalCalories);
  document.getElementById('protein').textContent = macros.protein;
  document.getElementById('fat').textContent = macros.fat;
  document.getElementById('carbs').textContent = macros.carbs;

  errorEl.hidden = true;
  resultEl.hidden = false;
});
