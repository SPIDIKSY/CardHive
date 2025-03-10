// Функция для получения данных о манге по ID
export async function fetchManga(id) {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = `https://shikimori.one/api/mangas/${id}`;
  try {
    const response = await fetch(`${proxyUrl}${apiUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Адаптируем данные под ожидаемую структуру
    return {
      id: data.id,
      russian: data.russian || data.name,
      name: data.name,
      image: { original: data.image?.original ? `https://shikimori.one${data.image.original}` : '/public/assets/images/default-manga.jpg' },
      aired_on: data.aired_on || '—',
      genres: data.genres || [],
      english: data.english || [],
      description: data.description || 'Описание отсутствует',
    };
  } catch (error) {
    console.error('Fetch manga error:', error);
    // Fallback: возвращаем заглушку
    return {
      id,
      russian: "Пример манги",
      name: "Example Manga",
      image: { original: "/public/assets/images/default-manga.jpg" },
      aired_on: "2020-01-01",
      genres: [{ name: "Фэнтези" }, { name: "Приключения" }],
      english: ["Alt Title"],
      description: "Это пример описания манги.",
    };
  }
}

// Функция для поиска манги
export async function searchTitles(query) {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = `https://shikimori.one/api/mangas?search=${encodeURIComponent(query)}&limit=10`;
  try {
    const response = await fetch(`${proxyUrl}${apiUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Адаптируем данные
    return data.map(item => ({
      id: item.id,
      russian: item.russian || item.name,
      name: item.name,
      image: { original: item.image?.original ? `https://shikimori.one${item.image.original}` : '/public/assets/images/default-manga.jpg' },
    }));
  } catch (error) {
    console.error('Search titles error:', error);
    // Fallback: возвращаем заглушку
    return [
      {
        id: 1,
        russian: `Поиск: ${query}`,
        name: `Search: ${query}`,
        image: { original: "/public/assets/images/default-manga.jpg" },
      },
    ];
  }
}

// Функция для получения популярных тайтлов
export async function fetchPopularTitles() {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = 'https://shikimori.one/api/mangas?limit=10&order=popularity&season=2024';
  try {
    const response = await fetch(`${proxyUrl}${apiUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Адаптируем данные
    return data.map(item => ({
      id: item.id,
      russian: item.russian || item.name,
      name: item.name,
      image: { original: item.image?.original ? `https://shikimori.one${item.image.original}` : '/public/assets/images/default-manga.jpg' },
      aired_on: item.aired_on || '—',
      genres: item.genres || [],
      english: item.english || [],
      description: item.description || 'Описание отсутствует',
    }));
  } catch (error) {
    console.error('Fetch popular titles error:', error);
    // Fallback: возвращаем заглушку
    return [
      {
        id: 1,
        russian: "Популярная манга 1",
        name: "Popular Manga 1",
        image: { original: "/public/assets/images/default-manga.jpg" },
      },
      {
        id: 2,
        russian: "Популярная манга 2",
        name: "Popular Manga 2",
        image: { original: "/public/assets/images/default-manga.jpg" },
      },
    ];
  }
}

// Функция для получения детальной информации о манге (используется в searchModal.js)
export async function fetchMangaDetails(id) {
  return await fetchManga(id); // Переиспользуем fetchManga
}
