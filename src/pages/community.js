// src/pages/community.js
import { generateZeroCard } from '../components/cards.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  const postForm = document.getElementById('post-form');
  const postsContainer = document.getElementById('posts');

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `
      <h3>${title}</h3>
      <p>${content}</p>
      <div class="post-actions">
        <button class="btn like-btn">Лайк</button>
        <button class="btn comment-btn">Коммент</button>
      </div>
    `;
    postsContainer.prepend(post);

    postForm.reset();
  });

  const recCard = document.getElementById('rec-card-1');
  const card = generateZeroCard('/assets/images/default-manga.jpg', 'rec-card');
  recCard.appendChild(card);
});