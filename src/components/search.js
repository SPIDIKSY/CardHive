// Импортируем функцию открытия модального окна поиска
import { openSearchModal } from './searchModal.js';

// Функция инициализации поиска
export function initSearch() {
  const searchInput = document.getElementById('home-search'); // Ищем поле ввода поиска
  if (!searchInput) { // Проверяем, есть ли элемент на странице
    console.log('Элемент #home-search не найден на этой странице');
    return;
  }

  // Открываем модальное окно при клике на поле поиска
  searchInput.addEventListener('click', () => {
    openSearchModal(searchInput.value);
  });

  // Открываем модальное окно при нажатии Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      openSearchModal(searchInput.value);
    }
  });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});