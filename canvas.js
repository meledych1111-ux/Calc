// --- Работа с Canvas и MyScript ---

const canvas = document.getElementById('canvas');

// Масштабирование под Retina / мобильные экраны
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Инициализация MyScript
const editor = MyScript.register(canvas, {
  recognitionParams: {
    type: 'MATH',
    protocol: 'WEBSOCKET', // если не работает, можно заменить на 'REST'
    server: {
      scheme: 'https',
      host: 'cloud.myscript.com',
      applicationKey: 'd89e9a37-0d3e-4a0d-aeed-38c6b64fb96d', // demo-ключ
      hmacKey: '1e0a8a3a-04d7-4aa0-9a44-2c6c0c9c0a4c'
    }
  }
});

// События MyScript
editor.on('loaded', () => console.log('MyScript готов'));
editor.on('error', e => console.error('Ошибка MyScript', e));

editor.on('exported', evt => {
  const latex = evt.detail.exports['application/x-latex'];
  if (latex) {
    const ready = latex
      .replace(/\\times/g, '*')
      .replace(/\\div/g, '/')
      .replace(/\\sqrt\{(.*?)\}/g, 'sqrt($1)')
      .replace(/\^\{(.*?)\}/g, '^$1')
      .replace(/\\pi/g, 'π')
      .replace(/\\ln/g, 'ln')
      .replace(/\\log/g, 'log')
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan');

    expr = ready;
    screen.value = expr;
    reset = false;
    calc(); // сразу считаем
  }
});

// Кнопка очистки холста
document.getElementById('clearPad').addEventListener('click', () => editor.clear());
