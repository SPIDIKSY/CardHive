import { generateZeroCard } from '../components/cards.js';

document.addEventListener('DOMContentLoaded', () => {
  // Паки
  const packsGrid = document.getElementById('packs-grid');
  const packs = [
    { name: 'Стандартный пак', price: 20, type: 'standard', img: '/public/assets/images/default-manga.jpg' },
    { name: 'Ивентовый пак', price: 30, type: 'event', img: '/public/assets/images/default-manga.jpg' },
    { name: 'Случайный пак', price: 15, type: 'random', img: '/public/assets/images/default-manga.jpg' },
    { name: 'Зимний набор', price: 40, type: 'seasonal', img: '/public/assets/images/default-manga.jpg' }
  ];

  packs.forEach(pack => {
    const packItem = document.createElement('div');
    packItem.className = 'pack-item';
    packItem.innerHTML = `
      <img src="${pack.img}" alt="${pack.name}">
      <h3>${pack.name}</h3>
      <p>Цена: ${pack.price} токенов</p>
      <div class="pack-buttons">
        <button class="btn buy-pack" data-type="${pack.type}">Купить</button>
        <button class="btn save-pack" data-type="${pack.type}">Сохранить</button>
      </div>
    `;
    packsGrid.appendChild(packItem);
  });

  const buyButtons = document.querySelectorAll('.buy-pack');
  const saveButtons = document.querySelectorAll('.save-pack');

  function getRandomRarity() {
    const rand = Math.random() * 100;
    if (rand < 0.1) return 'A+';
    if (rand < 1) return 'A';
    if (rand < 5) return 'B';
    if (rand < 15) return 'C';
    if (rand < 30) return 'D';
    return 'F';
  }

  function openPack(type) {
    const animation = document.createElement('div');
    animation.className = 'pack-animation';
    const content = document.createElement('div');
    content.className = 'pack-animation-content';
    animation.appendChild(content);
    document.body.appendChild(animation);

    const cards = Array(5).fill().map(() => ({
      img: '/public/assets/images/default-manga.jpg',
      rarity: getRandomRarity()
    }));

    cards.forEach(card => {
      const cardReveal = document.createElement('div');
      cardReveal.className = 'card-reveal';
      cardReveal.innerHTML = `<img src="${card.img}" alt="Card"><p>Редкость: ${card.rarity}</p>`;
      content.appendChild(cardReveal);
    });

    animation.addEventListener('click', () => animation.remove(), { once: true });
  }

  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const userCoins = parseInt(document.getElementById('user-coins').textContent);
      const price = packs.find(p => p.type === btn.dataset.type).price;
      if (userCoins >= price) {
        document.getElementById('user-coins').textContent = userCoins - price;
        openPack(btn.dataset.type);
      } else {
        alert('Недостаточно токенов!');
      }
    });
  });

  saveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const userCoins = parseInt(document.getElementById('user-coins').textContent);
      const price = packs.find(p => p.type === btn.dataset.type).price;
      if (userCoins >= price) {
        document.getElementById('user-coins').textContent = userCoins - price;
        alert(`Пак "${packs.find(p => p.type === btn.dataset.type).name}" сохранён в инвентарь!`);
      } else {
        alert('Недостаточно токенов!');
      }
    });
  });

  // Кастомизация профиля
  const customizationGrid = document.getElementById('customization-grid');
  const customizationItems = [
    { type: 'avatar', name: 'Анимированный аватар', price: 50, img: '/public/assets/images/avatar.jpg' },
    { type: 'frame', name: 'Редкая рамка', price: 30, img: '/public/assets/images/rare-frame.png' },
    { type: 'background', name: 'Фэнтези обложка', price: 40, img: '/public/assets/images/bg-fantasy.jpg' },
    { type: 'set', name: 'Коллекционный набор', price: 100, discountPrice: 85, items: ['avatar', 'frame', 'background'] }
  ];

  customizationItems.forEach(item => {
    const customizationItem = document.createElement('div');
    customizationItem.className = 'customization-item';
    customizationItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Цена: ${item.discountPrice ? `${item.discountPrice} (скидка 15%)` : item.price} токенов</p>
      <button class="btn preview-btn" data-type="${item.type}" data-img="${item.img}" ${item.items ? `data-items="${item.items.join(',')}"` : ''}>Предпросмотр</button>
      <button class="btn buy-customization" data-type="${item.type}" data-price="${item.discountPrice || item.price}" ${item.items ? `data-items="${item.items.join(',')}"` : ''}>Купить</button>
    `;
    customizationGrid.appendChild(customizationItem);
  });

  const previewAvatar = document.getElementById('preview-avatar');
  const previewFrame = document.getElementById('preview-frame');
  const previewBackground = document.getElementById('preview-background');
  const applyButton = document.getElementById('apply-customization');

  let selectedCustomization = {};

  document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.type === 'avatar' || btn.dataset.items?.includes('avatar')) {
        previewAvatar.src = btn.dataset.img;
        selectedCustomization.avatar = btn.dataset.img;
      }
      if (btn.dataset.type === 'frame' || btn.dataset.items?.includes('frame')) {
        previewFrame.style.backgroundImage = `url(${btn.dataset.img})`;
        selectedCustomization.frame = btn.dataset.img;
      }
      if (btn.dataset.type === 'background' || btn.dataset.items?.includes('background')) {
        previewBackground.style.backgroundImage = `url(${btn.dataset.img})`;
        selectedCustomization.background = btn.dataset.img;
      }
      applyButton.disabled = false;
    });
  });

  document.querySelectorAll('.buy-customization').forEach(btn => {
    btn.addEventListener('click', () => {
      const userCoins = parseInt(document.getElementById('user-coins').textContent);
      const price = parseInt(btn.dataset.price);
      if (userCoins >= price) {
        document.getElementById('user-coins').textContent = userCoins - price;
        if (btn.dataset.type === 'avatar' || btn.dataset.items?.includes('avatar')) {
          localStorage.setItem('profileAvatar', btn.dataset.img);
        }
        if (btn.dataset.type === 'frame' || btn.dataset.items?.includes('frame')) {
          localStorage.setItem('profileFrame', btn.dataset.img);
        }
        if (btn.dataset.type === 'background' || btn.dataset.items?.includes('background')) {
          localStorage.setItem('profileBackground', btn.dataset.img);
        }
        alert('Кастомизация приобретена и сохранена!');
      } else {
        alert('Недостаточно токенов!');
      }
    });
  });

  applyButton.addEventListener('click', () => {
    if (selectedCustomization.avatar) localStorage.setItem('profileAvatar', selectedCustomization.avatar);
    if (selectedCustomization.frame) localStorage.setItem('profileFrame', selectedCustomization.frame);
    if (selectedCustomization.background) localStorage.setItem('profileBackground', selectedCustomization.background);
    alert('Кастомизация применена!');
  });
});