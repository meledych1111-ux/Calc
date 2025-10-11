<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<title>Калькулятор 2025</title>
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
<style>
:root {
    --bg:#0d0d0d; --surface:#1a1a1a; --btn:#252525; --btnH:#333;
    --accent:#ff2e63; --text:#eaeaea; --text2:#aaa; --rad:24px;
    --trans:.18s;
}
*{box-sizing:border-box;font-family:Inter,system-ui,sans-serif;-webkit-tap-highlight-color:transparent}
body{margin:0;background:var(--bg);color:var(--text);display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:.5rem}
.calc{width:100%;max-width:420px}
#screen{width:100%;font-size:3rem;font-weight:600;padding:1.2rem 1rem;text-align:right;border:none;background:var(--surface);border-radius:var(--rad);margin-bottom:.75rem}
#history{list-style:none;margin:0 0 .75rem;padding:.5rem 1rem;max-height:120px;overflow-y:auto;background:var(--surface);border-radius:var(--rad);font-size:1.1rem;color:var(--text2)}
#history li{display:flex;justify-content:space-between}
#history .res{color:var(--accent);font-weight:600}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem}
button{min-height:76px;font-size:1.8rem;font-weight:500;border:none;border-radius:22px;background:var(--btn);color:var(--text);cursor:pointer;transition:transform var(--trans),background var(--trans);box-shadow:0 4px 12px #0006}
button:active{transform:scale(.96);background:var(--btnH)}
.op{background:var(--accent);color:#fff}
.span2{grid-column:span 2}
.toggle{margin-top:1rem;text-align:center;font-size:1.1rem;color:var(--text2)}
.hidden{display:none !important}
@media(max-width:360px){#screen{font-size:2.4rem}button{min-height:68px;font-size:1.6rem}}
</style>
</head>
<body>
<main class="calc">
  <input id="screen" readonly placeholder="0"/>
  <ul id="history"></ul>

  <section class="buttons">
    <div id="basic" class="grid">
      <button data-op="clear">C</button>
      <button data-op="sign">+/-</button>
      <button data-op="percent">%</button>
      <button data-op="/" class="op">÷</button>

      <button data-val="7">7</button>
      <button data-val="8">8</button>
      <button data-val="9">9</button>
      <button data-op="*" class="op">×</button>

      <button data-val="4">4</button>
      <button data-val="5">5</button>
      <button data-val="6">6</button>
      <button data-op="-" class="op">-</button>

      <button data-val="1">1</button>
      <button data-val="2">2</button>
      <button data-val="3">3</button>
      <button data-op="+" class="op">+</button>

      <button data-val="0" class="span2">0</button>
      <button data-val=".">.</button>
      <button data-op="=" class="op">=</button>
    </div>

    <div id="scientific" class="grid hidden">
      <button data-op="clear">C</button>
      <button data-op="("
