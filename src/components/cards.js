export function generateZeroCard(imageUrl, id) {
  const canvas = document.createElement('canvas');
  canvas.className = 'zero-card';
  canvas.width = 200;
  canvas.height = 300;
  canvas.id = id;

  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl;

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(id.split('-')[1] || 'Card', canvas.width / 2, canvas.height - 20);
  };

  img.onerror = () => {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Ошибка загрузки', canvas.width / 2, canvas.height / 2);
  };

  return canvas;
}
