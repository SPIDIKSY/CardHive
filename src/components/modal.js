export function initMangaClicks() {
  const mangaCards = document.querySelectorAll('.manga-card');
  
  mangaCards.forEach(card => {
    card.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'fullscreen-modal';

      modal.innerHTML = `
        <div class="fullscreen-modal-content">
          <span class="modal-close">×</span>
          <img src="${card.querySelector('img').src}" alt="${card.querySelector('h3').textContent}" loading="lazy" onerror="this.src='/public/assets/images/default-manga.jpg'">
          <h2>${card.querySelector('h3').textContent}</h2>
          <p><strong>Год:</strong> ${card.dataset.year || '—'}</p>
          <p><strong>Жанры:</strong> ${card.dataset.genres || '—'}</p>
          <p><strong>Альтернативные названия:</strong> ${card.dataset.altTitles || '—'}</p>
          <p>${card.dataset.description || 'Описание отсутствует'}</p>
        </div>
      `;
      document.body.appendChild(modal);

      setTimeout(() => modal.classList.add('active'), 10);

      const closeButton = modal.querySelector('.modal-close');
      closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 400);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          setTimeout(() => modal.remove(), 400);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMangaClicks();
});