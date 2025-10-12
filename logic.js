const screen = document.getElementById('screen');
let expr = '';
let reset = false;

function write(s) {
  if (reset) { expr = ''; reset = false; }
  expr += s;
  screen.value = expr || '0';
}

// --- Парсер ---
const Parser = (() => {
  const PI = Math.PI, E = Math.E;
  function tokenize(str) {
    const re = /\s*([a-z]+|\d+\.?\d*|\.\d+|[+\-*/^(),πe])\s*/g;
    let m, out = [];
    while ((m = re.exec(str)) !== null) out.push(m[1]);
    return out;
  }
  function parse(expr) {
    const t = tokenize(expr);
    let pos = 0;
    function peek() { return t[pos]; }
    function consume(v) { if (peek() !== v) throw new Error('Expected ' + v); pos++; }
    function parseAdd() {
      let left = parseMul();
      while (peek() === '+' || peek() === '-') {
        const op = peek(); pos++;
        const right = parseMul();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    }
    function parseMul() {
      let left = parsePow();
      while (peek() === '*' || peek() === '/') {
        const op = peek(); pos++;
        const right = parsePow();
        left = op === '*' ? left * right : left / right;
      }
      return left;
    }
    function parsePow() {
      let left = parseUnary();
      if (peek() === '^') { pos++; const right = parsePow(); left = Math.pow(left, right); }
      return left;
    }
    function parseUnary() {
      if (peek() === '-') { pos++; return -parseUnary(); }
      return parseAtom();
    }
    function parseAtom() {
      const v = peek();
      if (v === '(') { pos++; const inner = parseAdd(); consume(')'); return inner; }
      if (v === 'sin') { pos++; consume('('); const arg = parseAdd(); consume(')'); return Math.sin(arg); }
      if (v === 'cos') { pos++; consume('('); const arg = parseAdd(); consume(')'); return Math.cos(arg); }
      if (v === 'tan') { pos++; consume('('); const arg = parseAdd(); consume(')'); return Math.tan(arg); }
      if (v === 'log') { pos++; consume('('); const arg = parseAdd(); consume(')'); return Math.log10(arg); }
      if (v === 'ln')  { pos++; consume('('); const arg = parseAdd(); consume(')'); return Math.log(arg); }
      if (v === 'sqrt'){ pos++; consume('('); const arg = parseAdd(); consume(')'); return Math.sqrt(arg); }
      if (v === 'π') { pos++; return PI; }
      if (v === 'e') { pos++; return E; }
      if (!isNaN(v)) { pos++; return parseFloat(v); }
      throw new Error('Bad token ' + v);
    }
    const res = parseAdd();
    if (pos !== t.length) throw new Error('Extra tokens');
    return res;
  }
  return { parse };
})();

function calc() {
  try {
    let normalized = expr.replace(/×/g, '*').replace(/÷/g, '/');
    const res = Parser.parse(normalized);
    expr = Number(res).toLocaleString('ru-RU', { maximumFractionDigits: 10 });
    screen.value = expr;
    reset = true;
  } catch {
    screen.value = 'Error';
    expr = '';
    reset = true;
  }
}
function clearAll() { expr = ''; screen.value = '0'; reset = false; }

// кнопки
document.querySelectorAll('button[data-val]').forEach(b =>
  b.addEventListener('click', () => write(b.dataset.val))
);
document.querySelectorAll('button[data-op]').forEach(b =>
  b.addEventListener('click', () => {
    const op = b.dataset.op;
    if (op === '=') calc();
    else if (op === 'clear') clearAll();
    else write(op);
  })
);
document.querySelectorAll('button[data-fn]').forEach(b =>
  b.addEventListener('click', () => write(b.dataset.fn + '('))
);
