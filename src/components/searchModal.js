import { searchTitles, fetchMangaDetails } from '../utils/api.js';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function openSearchModal(query) {
  const modal = document.createElement('div');
  modal.className = 'search-modal';

  modal.innerHTML = `
    <div class="search-modal-content">
      <input type="text" id="modal-search-input" value="${query || ''}" placeholder="Поиск манги...">
      <div class="search-results" id="search-results"></div>
    </div>
  `;
  document.body.appendChild(modal);

  setTimeout(() => modal.classList.add('active'), 10);

  const input = modal.querySelector('#modal-search-input');
  const resultsContainer = modal.querySelector('#search-results');

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 400);
    }
  });

  const handleSearch = debounce(async () => {
    const searchQuery = input.value.trim();
    if (searchQuery) {
      const results = await searchTitles(searchQuery);
      displaySearchResults(results, resultsContainer);
    } else {
      resultsContainer.innerHTML = '';
    }
  }, 300);

  input.addEventListener('input', handleSearch);

  if (query) {
    input.dispatchEvent(new Event('input'));
  }
}

function displaySearchResults(results, container) {
  container.innerHTML = '';
  if (results.error || !results.length) {
    container.innerHTML = '<p>Ничего не найдено</p>';
    return;
  }

  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'search-result';
    resultDiv.dataset.id = result.id;
    resultDiv.innerHTML = `
      <img src="${result.image.original}" alt="${result.russian || result.name}" loading="lazy" onerror="this.src='/public/assets/images/default-manga.jpg'">
      <h3>${result.russian || result.name}</h3>
    `;
    container.appendChild(resultDiv);
  });

  initSearchResultClicks();
}

function initSearchResultClicks() {
  const results = document.querySelectorAll('.search-result');
  results.forEach(result => {
    result.addEventListener('click', async () => {
      const mangaId = result.dataset.id;
      const mangaData = await fetchMangaDetails(mangaId);

      const searchModal = document.querySelector('.search-modal');
      searchModal.classList.remove('active');
      setTimeout(() => searchModal.remove(), 400);

      const titleModal = document.createElement('div');
      titleModal.className = 'fullscreen-modal';
      titleModal.innerHTML = `
        <div class="fullscreen-modal-content">
          <span class="modal-close">×</span>
          <img src="${mangaData.image.original}" alt="${mangaData.russian || mangaData.name}" loading="lazy" onerror="this.src='/public/assets/images/default-manga.jpg'">
          <h2>${mangaData.russian || mangaData.name}</h2>
          <p><strong>Год:</strong> ${mangaData.aired_on?.split('-')[0] || '—'}</p>
          <p><strong>Жанры:</strong> ${mangaData.genres?.map(g => g.name).join(', ') || '—'}</p>
          <p><strong>Альтернативные названия:</strong> ${mangaData.english?.join(', ') || '—'}</p>
          <p>${mangaData.description || 'Описание отсутствует'}</p>
        </div>
      `;
      document.body.appendChild(titleModal);
      setTimeout(() => titleModal.classList.add('active'), 10);

      titleModal.querySelector('.modal-close').addEventListener('click', () => {
        titleModal.classList.remove('active');
        setTimeout(() => titleModal.remove(), 400);
      });

      titleModal.addEventListener('click', (e) => {
        if (e.target === titleModal) {
          titleModal.classList.remove('active');
          setTimeout(() => titleModal.remove(), 400);
        }
      });
    });
  });
}