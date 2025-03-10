// Импортируем функцию инициализации поиска
import { initSearch } from './components/search.js';

document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем поиск (работает только на страницах с #home-search)
  initSearch();

  // Элементы для переключения тем
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Элементы для выпадающего меню
  const avatar = document.getElementById('avatar');
  const dropdown = document.getElementById('dropdown');

  // Элементы боевого пропуска (могут отсутствовать на некоторых страницах)
  const buyPremiumBtn = document.querySelector('.buy-premium');
  const claimButtons = document.querySelectorAll('.claim');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');

  // --- Переключение тем ---
  const savedTheme = localStorage.getItem('theme'); // Получаем сохранённую тему
  if (savedTheme === 'light') {
    body.classList.add('light-theme'); // Применяем светлую тему
    toggle.checked = true; // Устанавливаем переключатель
  } else {
    body.classList.remove('light-theme'); // Устанавливаем тёмную тему
    toggle.checked = false;
  }

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light'); // Сохраняем выбор
    } else {
      body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  });

  // --- Выпадающее меню ---
  if (avatar && dropdown) { // Проверяем наличие элементов
    avatar.addEventListener('click', () => {
      dropdown.classList.toggle('active'); // Показываем/скрываем меню
    });

    document.addEventListener('click', (e) => {
      if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active'); // Закрываем при клике вне меню
      }
    });
  }

  // --- Боевой пропуск ---
  let currentXP = 2000; // Текущий опыт
  const maxXP = 10000;  // Максимальный опыт для уровня
  let currentLevel = 10; // Текущий уровень
  let isPremium = false; // Статус премиум-доступа

  // Функция обновления прогресс-бара
  function updateProgress() {
    if (!progressFill || !progressText) { // Проверяем наличие элементов
      console.log('Элементы прогресса не найдены на этой странице');
      return;
    }
    const percentage = (currentXP / maxXP) * 100; // Вычисляем процент
    progressFill.style.width = `${percentage}%`; // Устанавливаем ширину заполнения
    progressText.textContent = `Уровень ${currentLevel} / 50 (${currentXP}/${maxXP} XP)`; // Обновляем текст
  }

  // Покупка премиум-доступа
  if (buyPremiumBtn) { // Проверяем наличие кнопки
    buyPremiumBtn.addEventListener('click', () => {
      const userCoins = parseInt(document.getElementById('user-coins').textContent);
      if (userCoins >= 50) {
        document.getElementById('user-coins').textContent = userCoins - 50; // Снимаем монеты
        isPremium = true;
        buyPremiumBtn.disabled = true; // Отключаем кнопку
        buyPremiumBtn.textContent = 'Премиум активирован';
        alert('Премиум-доступ активирован! Все премиум-награды теперь доступны.');
      } else {
        alert('Недостаточно монет для покупки премиум-доступа!');
      }
    });
  }

  // Обработка заданий
  if (claimButtons.length > 0) { // Проверяем наличие кнопок заданий
    claimButtons.forEach(button => {
      button.addEventListener('click', () => {
        const taskXP = parseInt(button.parentElement.textContent.match(/\d+/)[0]); // Получаем XP из текста
        currentXP += taskXP; // Добавляем опыт
        if (currentXP >= maxXP) {
          currentXP -= maxXP; // Сбрасываем опыт при достижении максимума
          currentLevel++; // Увеличиваем уровень
          checkLevelRewards(); // Проверяем награды
        }
        updateProgress(); // Обновляем прогресс
        button.disabled = true; // Отключаем кнопку
        button.textContent = 'Получено';
      });
    });
  }

  // Проверка наград при достижении уровня
  function checkLevelRewards() {
    const levels = document.querySelectorAll('.level');
    levels.forEach(level => {
      const levelNum = parseInt(level.getAttribute('data-level'));
      if (levelNum <= currentLevel) {
        const rewardText = level.querySelector('p').textContent;
        if (level.classList.contains('premium') && !isPremium) {
          return; // Премиум-награды недоступны без премиума
        }
        console.log(`Получена награда за уровень ${levelNum}: ${rewardText}`);
        // Здесь можно добавить логику выдачи наград
      }
    });
  }

  // Инициализация прогресса
  updateProgress();
});