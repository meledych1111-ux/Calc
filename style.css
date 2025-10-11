/********************************************************************
 * 1. Комплексные числа
 *******************************************************************/
class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }
    static from(v) {
        if (v instanceof Complex) return v;
        return new Complex(v, 0);
    }
    add(z) {
        z = Complex.from(z);
        return new Complex(this.re + z.re, this.im + z.im);
    }
    sub(z) {
        z = Complex.from(z);
        return new Complex(this.re - z.re, this.im - z.im);
    }
    mul(z) {
        z = Complex.from(z);
        return new Complex(
            this.re * z.re - this.im * z.im,
            this.re * z.im + this.im * z.re
        );
    }
    div(z) {
        z = Complex.from(z);
        const d = z.re * z.re + z.im * z.im;
        return new Complex(
            (this.re * z.re + this.im * z.im) / d,
            (this.im * z.re - this.re * z.im) / d
        );
    }
    pow(z) {
        // z^w = exp(w ln z)
        z = Complex.from(z);
        const r = Math.hypot(this.re, this.im);
        const theta = Math.atan2(this.im, this.re);
        const arg = z.mul(new Complex(Math.log(r), theta));
        const exp = Math.exp(arg.re);
        return new Complex(exp * Math.cos(arg.im), exp * Math.sin(arg.im));
    }
    sqrt() {
        return this.pow(new Complex(0.5));
    }
    sin() {
        return new Complex(
            Math.sin(this.re) * Math.cosh(this.im),
            Math.cos(this.re) * Math.sinh(this.im)
        );
    }
    cos() {
        return new Complex(
            Math.cos(this.re) * Math.cosh(this.im),
            -Math.sin(this.re) * Math.sinh(this.im)
        );
    }
    tan() {
        const s = this.sin(), c = this.cos();
        return s.div(c);
    }
    ln() {
        const r = Math.hypot(this.re, this.im);
        return new Complex(Math.log(r), Math.atan2(this.im, this.re));
    }
    toString() {
        const { re, im } = this;
        if (Math.abs(im) < 1e-14) return re.toString();
        if (Math.abs(re) < 1e-14) return im + 'i';
        return `${re}${im < 0 ? '' : '+'}${im}i`;
    }
}

/********************************************************************
 * 2. Парсер выражений (скобки любой глубины)
 *    Поддерживает + - * / ^ sin cos tan log ln sqrt π e и комплексные
 *******************************************************************/
const Parser = (() => {
    const PI = new Complex(Math.PI);
    const E  = new Complex(Math.E);

    function tokenize(expr) {
        const re = /\s*(\+|\-|\*|\/|\^|\(|\)|,|[a-zA-Z]+|\d+(?:\.\d+)?)\s*/g;
        const toks = [];
        let m;
        while ((m = re.exec(expr)) !== null) toks.push(m[1]);
        return toks;
    }

    function parse(expr) {
        const t = tokenize(expr);
        let pos = 0;

        function peek() { return t[pos]; }
        function consume(v) {
            if (peek() !== v) throw new Error('Expected ' + v);
            pos++;
        }

        function parseAdd() {
            let left = parseMul();
            while (peek() === '+' || peek() === '-') {
                const op = peek();
                pos++;
                const right = parseMul();
                left = op === '+' ? left.add(right) : left.sub(right);
            }
            return left;
        }

        function parseMul() {
            let left = parsePow();
            while (peek() === '*' || peek() === '/') {
                const op = peek();
                pos++;
                const right = parsePow();
                left = op === '*' ? left.mul(right) : left.div(right);
            }
            return left;
        }

        function parsePow() {
            let left = parseUnary();
            if (peek() === '^') {
                pos++;
                const right = parsePow(); // right-assoc
                left = left.pow(right);
            }
            return left;
        }

        function parseUnary() {
            if (peek() === '-') {
                pos++;
                return parseUnary().mul(-1);
            }
            return parseAtom();
        }

        function parseAtom() {
            const v = peek();
            if (v === '(') {
                pos++;
                const inner = parseAdd();
                consume(')');
                return inner;
            }
            if (v === 'sin') { pos++; consume('('); const arg = parseAdd(); consume(')'); return arg.sin(); }
            if (v === 'cos') { pos++; consume('('); const arg = parseAdd(); consume(')'); return arg.cos(); }
            if (v === 'tan') { pos++; consume('('); const arg = parseAdd(); consume(')'); return arg.tan(); }
            if (v === 'log') { pos++; consume('('); const arg = parseAdd(); consume(')'); return new Complex(Math.log10(arg.re)); }
            if (v === 'ln')  { pos++; consume('('); const arg = parseAdd(); consume(')'); return arg.ln(); }
            if (v === 'sqrt'){ pos++; consume('('); const arg = parseAdd(); consume(')'); return arg.sqrt(); }
            if (v === 'π') { pos++; return PI; }
            if (v === 'e') { pos++; return E; }
            if (!isNaN(v)) { pos++; return new Complex(parseFloat(v)); }
            throw new Error('Unexpected token ' + v);
        }

        const res = parseAdd();
        if (pos !== t.length) throw new Error('Extra tokens');
        return res;
    }
    return { parse };
})();

/********************************************************************
 * 3. История (localStorage)
 *******************************************************************/
const History = (() => {
    const KEY = 'calcHistory';
    const list = document.getElementById('history');
    let items = JSON.parse(localStorage.getItem(KEY) || '[]');

    function render() {
        list.innerHTML = '';
        items.forEach(({ expr, res }) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${expr}</span><span class="res">${res}</span>`;
            list.appendChild(li);
        });
        list.scrollTop = list.scrollHeight;
    }
    function push(expr, res) {
        items.push({ expr, res });
        if (items.length > 50) items.shift();
        localStorage.setItem(KEY, JSON.stringify(items));
        render();
    }
    function clear() {
        items = [];
        localStorage.removeItem(KEY);
        render();
    }
    render();
    return { push, clear };
})();

/********************************************************************
 * 4. Калькулятор-контроллер
 *******************************************************************/
const Calc = (() => {
    const screen = document.getElementById('screen');
    let expr = ''; // текущее выражение
    let reset = false;

    function write(str) {
        if (reset) { expr = ''; reset = false; }
        expr += str;
        screen.value = expr;
    }
    function evaluate() {
        try {
            const res = Parser.parse(expr);
            const resStr = res.toString();
            History.push(expr, resStr);
            expr = resStr;
            screen.value = expr;
            reset = true;
        } catch (e) {
            screen.value = 'Error';
            expr = '';
            reset = true;
        }
    }
    function clear() {
        expr = '';
        screen.value = '0';
        reset = false;
    }
    function back() {
        expr = expr.slice(0, -1);
        screen.value = expr || '0';
    }
    function init() {
        screen.value = '0';
        // кнопки
        document.querySelectorAll('button[data-val]').forEach(btn =>
            btn.addEventListener('click', () => write(btn.dataset.val))
        );
        document.querySelectorAll('button[data-op]').forEach(btn =>
            btn.addEventListener('click', () => {
                const op = btn.dataset.op;
                if (op === '=') evaluate();
                else if (op === 'clear') clear();
                else if (op === 'sign') {
                    // меняем знак последнего числа
                    const m = expr.match(/(-?\d+(?:\.\d+)?|[-+*/^()]|[a-z]+)$/);
                    if (m) {
                        const last = m[0];
                        if (!isNaN(last)) {
                            expr = expr.slice(0, -last.length) + (parseFloat(last) * -1);
                            screen.value = expr;
                        }
                    }
                } else write(op);
            })
        );
        document.querySelectorAll('button[data-fn]').forEach(btn =>
            btn.addEventListener('click', () => write(btn.dataset.fn + '('))
        );
        // переключатель
        document.getElementById('sciToggle').addEventListener('change', e => {
            document.getElementById('scientific').classList.toggle('hidden');
            document.getElementById('basic').classList.toggle('hidden');
        });
    }
    return { init, write, evaluate, clear };
})();

Calc.init();

/********************************************************************
 * 5. MyScript (рукописный ввод)
 *******************************************************************/
const editor = MyScript.register(document.getElementById('canvas'), {
    recognitionParams: {
        type: 'MATH',
        protocol: 'WEBSOCKET',
        server: {
            scheme: 'https',
            host: 'cloud.myscript.com',
            applicationKey: 'YOUR-KEY',
            hmacKey: 'YOUR-HMAC'
        }
    }
});
editor.on('exported', evt => {
    const latex = evt.detail.exports['application/x-latex'];
    if (latex) {
        // простейшая замена LaTeX → наша грамматика
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
        Calc.write(ready);
    }
});
