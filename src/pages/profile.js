// Импортируем функцию для генерации карт
import { generateZeroCard } from '../components/cards.js';

document.addEventListener('DOMContentLoaded', () => {
  // Загрузка кастомизации из localStorage
  const savedAvatar = localStorage.getItem('profileAvatar'); // Получаем сохранённый аватар
  const savedFrame = localStorage.getItem('profileFrame'); // Получаем сохранённую рамку
  const savedBg = localStorage.getItem('profileBackground'); // Получаем сохранённый фон
  const avatar = document.querySelector('.profile-avatar img'); // Находим элемент аватара
  if (savedAvatar) avatar.src = savedAvatar; // Применяем сохранённый аватар
  if (savedFrame) avatar.parentElement.style.backgroundImage = `url(${savedFrame})`; // Применяем рамку к контейнеру
  if (savedBg) document.querySelector('.profile-header').style.background = `url(${savedBg})`; // Применяем фон к шапке

  // Переключение табов
  const tabs = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active')); // Убираем активный класс у всех табов
      contents.forEach(c => c.classList.remove('active')); // Убираем активный класс у всего контента

      tab.classList.add('active'); // Добавляем активный класс выбранному табу
      document.getElementById(tab.dataset.tab).classList.add('active'); // Показываем соответствующий контент
    });
  });

  // Визуальная кастомизация
  document.querySelector('.edit-profile').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'fullscreen-modal';
    modal.innerHTML = `
      <div class="fullscreen-modal-content">
        <span class="modal-close">×</span>
        <h2>Настройка профиля</h2>
        <label>Рамка:
          <select id="frame-select">
            <option value="">Без рамки</option>
            <option value="rare-frame">Редкая</option>
          </select>
        </label>
        <label>Фон:
          <select id="bg-select">
            <option value="">Стандартный</option>
            <option value="bg-fantasy">Фэнтези</option>
          </select>
        </label>
        <label>Аватар:
          <input type="file" id="avatar-upload" accept="image/*">
        </label>
        <button class="btn save-profile">Сохранить</button>
      </div>
    `;
    document.body.appendChild(modal); // Добавляем модальное окно в DOM

    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', () => modal.remove()); // Закрываем модальное окно

    const frameSelect = modal.querySelector('#frame-select');
    const bgSelect = modal.querySelector('#bg-select');
    const avatarUpload = modal.querySelector('#avatar-upload');

    frameSelect.addEventListener('change', () => {
      avatar.classList.remove('rare-frame'); // Убираем старую рамку
      if (frameSelect.value) avatar.classList.add(frameSelect.value); // Добавляем новую
    });
    bgSelect.addEventListener('change', () => {
      document.querySelector('.profile-header').style.background = bgSelect.value ? `url('/public/assets/images/${bgSelect.value}.jpg')` : ''; // Устанавливаем фон
    });
    avatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => avatar.src = reader.result; // Загружаем новый аватар
        reader.readAsDataURL(file);
      }
    });

    modal.querySelector('.save-profile').addEventListener('click', () => {
      localStorage.setItem('profileFrame', frameSelect.value); // Сохраняем рамку
      localStorage.setItem('profileBg', bgSelect.value); // Сохраняем фон
      alert('Изменения сохранены!');
      modal.remove(); // Закрываем модальное окно
    });
  });

  // Коллекция
  const showcase = document.getElementById('showcase-list');
  const sampleCards = [
    { image: '/public/assets/images/default-manga.jpg', id: 'card-1' }, // Исправлен путь
    { image: '/public/assets/images/default-manga.jpg', id: 'card-2' }
  ];
  sampleCards.forEach(cardData => {
    const card = generateZeroCard(cardData.image, cardData.id); // Генерируем карты
    showcase.appendChild(card);
  });

  // Статистика (Chart.js)
  const ctx = document.getElementById('collection-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май'], // Месяцы для графика
      datasets: [{
        label: 'Собранные карты',
        data: [5, 10, 8, 15, 12], // Данные для графика
        backgroundColor: '#ff6f00',
        borderColor: '#e65c00',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } } // Начинаем ось Y с нуля
    }
  });
});