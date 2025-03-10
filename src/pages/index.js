import { fetchPopularTitles } from '../utils/api.js';
import { initMangaClicks } from '../components/modal.js';

document.addEventListener('DOMContentLoaded', async () => {
  const showcase = document.getElementById('popular-section');
  if (!showcase) {
    console.error('Элемент #popular-section не найден. Проверь HTML-разметку.');
    return;
  }

  try {
    const titles = await fetchPopularTitles();
    showcase.innerHTML = '';

    titles.forEach(title => {
      const card = document.createElement('div');
      card.className = 'manga-card';
      card.dataset.id = title.id;
      card.dataset.year = title.aired_on?.split('-')[0] || '—';
      card.dataset.genres = title.genres?.map(g => g.name).join(', ') || '—';
      card.dataset.altTitles = title.english?.join(', ') || '—';
      card.dataset.description = title.description || 'Описание отсутствует';

      card.innerHTML = `
        <img src="${title.image.original}" alt="${title.russian || title.name}" loading="lazy" onerror="this.src='/public/assets/images/default-manga.jpg'">
        <h3>${title.russian || title.name}</h3>
      `;
      showcase.appendChild(card);
    });

    initMangaClicks();
  } catch (error) {
    console.error('Ошибка при загрузке популярных тайтлов:', error);
    showcase.innerHTML = '<p>Не удалось загрузить популярные тайтлы</p>';
  }
});