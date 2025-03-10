import { generateZeroCard } from '../components/cards.js';

document.addEventListener('DOMContentLoaded', () => {
  // Календарь событий
  const eventsList = document.getElementById('events-list');
  const sampleEvents = [
    { title: 'Летний фестиваль', date: '2025-06-01', description: 'Собирай летние карты!' },
    { title: 'Хэллоуинская охота', date: '2025-10-31', description: 'Ищи редкие карты!' }
  ];

  sampleEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
      <h3>${event.title}</h3>
      <p>Дата: ${event.date}</p>
      <p>${event.description}</p>
    `;
    eventsList.appendChild(eventItem);

    // Уведомление за день до события
    const eventDate = new Date(event.date);
    const now = new Date();
    const oneDayBefore = new Date(eventDate);
    oneDayBefore.setDate(eventDate.getDate() - 1);
    if (now.toDateString() === oneDayBefore.toDateString()) {
      Push.create('Напоминание', {
        body: `Событие "${event.title}" начнётся завтра!`,
        timeout: 5000
      });
    }
  });

  // Боевой пропуск
  let eventXP = 0;
  const maxEventXP = 500;
  let eventLevel = 1;
  let isEventPremium = false;

  const progressFill = document.getElementById('event-progress-fill');
  const progressText = document.getElementById('event-progress-text');
  const buyPremiumBtn = document.getElementById('buy-event-premium');
  const passLevels = document.getElementById('event-pass-levels');
  const tasksList = document.getElementById('event-tasks');

  function updateEventProgress() {
    const percentage = (eventXP / maxEventXP) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Уровень ${eventLevel} / 20 (${eventXP}/${maxEventXP} XP)`;
  }

  buyPremiumBtn.addEventListener('click', () => {
    const userCoins = parseInt(document.getElementById('user-coins').textContent);
    if (userCoins >= 50) {
      document.getElementById('user-coins').textContent = userCoins - 50;
      isEventPremium = true;
      buyPremiumBtn.disabled = true;
      buyPremiumBtn.textContent = 'Премиум активирован';
      alert('Премиум-доступ для события активирован!');
    } else {
      alert('Недостаточно монет!');
    }
  });

  const levels = [
    { level: 1, free: '5 токенов', premium: 'Редкая карта' },
    { level: 5, free: '10 токенов', premium: 'Пак карт' }
  ];
  levels.forEach(l => {
    const freeLevel = document.createElement('div');
    freeLevel.className = 'level free';
    freeLevel.dataset.level = l.level;
    freeLevel.innerHTML = `<span>${l.level}</span><p>${l.free}</p>`;
    passLevels.appendChild(freeLevel);

    const premiumLevel = document.createElement('div');
    premiumLevel.className = 'level premium';
    premiumLevel.dataset.level = l.level;
    premiumLevel.innerHTML = `<span>${l.level}</span><p>${l.premium}</p>`;
    passLevels.appendChild(premiumLevel);
  });

  const tasks = [
    { text: 'Соверши 10 обменов', xp: 100, progress: 0, max: 10 },
    { text: 'Собери 5 карт', xp: 50, progress: 0, max: 5 }
  ];
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${task.text}
      <div class="task-progress">
        <div class="task-progress-bar">
          <div class="task-progress-fill" style="width: ${(task.progress / task.max) * 100}%"></div>
        </div>
        <span>${task.progress}/${task.max}</span>
        <button class="btn claim" ${task.progress < task.max ? 'disabled' : ''}>Получить (${task.xp} XP)</button>
      </div>
    `;
    tasksList.appendChild(li);

    const claimBtn = li.querySelector('.claim');
    claimBtn.addEventListener('click', () => {
      eventXP += task.xp;
      if (eventXP >= maxEventXP) {
        eventXP -= maxEventXP;
        eventLevel++;
      }
      updateEventProgress();
      claimBtn.disabled = true;
      claimBtn.textContent = 'Получено';
    });
  });

  // Мини-игра: Коллекционная охота
  const huntArea = document.getElementById('hunt-area');
  const hiddenCard = document.getElementById('hidden-card');
  const claimHuntReward = document.getElementById('claim-hunt-reward');
  const watchAd = document.getElementById('watch-ad');
  const hint = document.getElementById('hunt-hint');

  function resetHunt() {
    const x = Math.random() * (huntArea.offsetWidth - 50);
    const y = Math.random() * (huntArea.offsetHeight - 70);
    hiddenCard.style.left = `${x}px`;
    hiddenCard.style.top = `${y}px`;
    hiddenCard.style.display = 'block';
    claimHuntReward.disabled = true;
  }

  hiddenCard.addEventListener('click', () => {
    hiddenCard.style.display = 'none';
    claimHuntReward.disabled = false;
    hint.textContent = 'Карта найдена!';
  });

  claimHuntReward.addEventListener('click', () => {
    const userCoins = parseInt(document.getElementById('user-coins').textContent);
    document.getElementById('user-coins').textContent = userCoins + 5;
    alert('Получено 5 токенов!');
    resetHunt();
  });

  watchAd.addEventListener('click', () => {
    hint.textContent = `Карта в координатах (${Math.round(parseInt(hiddenCard.style.left))}, ${Math.round(parseInt(hiddenCard.style.top))})`;
    setTimeout(() => hint.textContent = 'Ищи в углу', 5000);
  });

  resetHunt();
});