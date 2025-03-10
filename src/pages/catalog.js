// src/pages/catalog.js
import { fetchManga } from '../utils/api.js';
import { initMangaClicks } from '../components/modal.js';
import { API_URL } from '../../config/constants.js';

let currentPage = 1;
let currentYear = "";

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function displayManga(mangaList, append = false) {
  const mangaGrid = document.getElementById("manga-grid");
  if (!append) mangaGrid.innerHTML = "";

  if (!mangaList.length) {
    mangaGrid.innerHTML = '<p>Манга не найдена</p>';
    return;
  }

  mangaList.forEach(manga => {
    const card = document.createElement("div");
    card.className = "manga-card";
    const imageUrl = manga.image?.original ? `https://shikimori.one${manga.image.original}` : "/assets/images/default-manga.jpg";
    card.innerHTML = `
      <img src="${imageUrl}" alt="${escapeHtml(manga.russian || manga.name)}" loading="lazy" onerror="this.src='/assets/images/default-manga.jpg'">
      <h3>${escapeHtml(manga.russian || manga.name)}</h3>
      <p>Год: ${escapeHtml(manga.aired_on?.split("-")[0] || "—")}</p>
    `;
    card.dataset.id = manga.id;
    card.dataset.year = manga.aired_on?.split("-")[0] || '—';
    card.dataset.genres = manga.genres?.map(g => g.name).join(', ') || '—';
    card.dataset.altTitles = manga.english?.join(', ') || '—';
    card.dataset.description = manga.description || 'Описание отсутствует';
    mangaGrid.appendChild(card);
  });

  initMangaClicks();
}

function populateYears() {
  const yearSelect = document.getElementById("year");
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1980; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  populateYears();
  const initialUrl = `${API_URL}?page=${currentPage}&limit=20&order=popularity`;
  const initialData = await fetchManga(initialUrl);
  displayManga(initialData);

  document.getElementById("search-button").addEventListener("click", async () => {
    currentPage = 1;
    const query = document.getElementById("search-input").value;
    const url = `${API_URL}?page=${currentPage}&limit=20&order=popularity${query ? `&search=${encodeURIComponent(query)}` : ''}${currentYear ? `&season=${currentYear}` : ''}`;
    const data = await fetchManga(url);
    displayManga(data);
  });

  document.getElementById("apply-filters").addEventListener("click", async () => {
    currentYear = document.getElementById("year").value;
    currentPage = 1;
    const query = document.getElementById("search-input").value;
    const url = `${API_URL}?page=${currentPage}&limit=20&order=popularity${query ? `&search=${encodeURIComponent(query)}` : ''}${currentYear ? `&season=${currentYear}` : ''}`;
    const data = await fetchManga(url);
    displayManga(data);
  });

  document.getElementById("load-more").addEventListener("click", async () => {
    currentPage++;
    const query = document.getElementById("search-input").value;
    const url = `${API_URL}?page=${currentPage}&limit=20&order=popularity${query ? `&search=${encodeURIComponent(query)}` : ''}${currentYear ? `&season=${currentYear}` : ''}`;
    const moreData = await fetchManga(url);
    displayManga(moreData, true);
  });
});
