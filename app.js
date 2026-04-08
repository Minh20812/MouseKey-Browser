let url = '';
let shift = false;

const rows = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
  ['space']
];

const shiftMap = {
  '`':'~','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^',
  '7':'&','8':'*','9':'(','0':')','-':'_','=':'+',
  '[':'{',']':'}','\\':'|',';':':','\'':'"',',':'<','.':'>','/':'?'
};

const display = document.getElementById('url-display');

function renderDisplay() {
  if (url === '') {
    display.innerHTML = '<span class="placeholder">Nhập địa chỉ web...</span><span class="cursor"></span>';
  } else {
    display.innerHTML = '<span>' + escHtml(url) + '</span><span class="cursor"></span>';
  }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function typeChar(c) { url += c; renderDisplay(); }

function del() {
  if (url.length > 0) { url = url.slice(0, -1); renderDisplay(); }
}

function flash(el) {
  el.classList.add('pressed');
  setTimeout(() => el.classList.remove('pressed'), 150);
}

function pressKey(k, el) {
  let c;
  if (k === 'space') { c = ' '; }
  else if (shift && shiftMap[k]) { c = shiftMap[k]; }
  else if (shift) { c = k.toUpperCase(); }
  else { c = k; }
  typeChar(c);
  if (shift) { shift = false; updateShiftUI(); }
  flash(el);
}

function toggleShift() {
  shift = !shift;
  updateShiftUI();
}

function updateShiftUI() {
  document.querySelectorAll('.shift-key').forEach(k => {
    k.classList.toggle('shift-active', shift);
  });
  document.querySelectorAll('.key[data-char]').forEach(k => {
    const orig = k.dataset.char;
    if (shift) {
      const up = shiftMap[orig] || orig.toUpperCase();
      k.textContent = up;
    } else {
      k.textContent = orig;
    }
  });
}

function go() {
  let u = url.trim();
  if (!u) return;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  window.open(u, '_blank');
}

function makeKey(label, cls) {
  const b = document.createElement('button');
  b.className = 'key' + (cls ? ' ' + cls : '');
  b.textContent = label;
  return b;
}

function buildKeyboard() {
  // Row 0: numbers + backspace
  const r1 = document.getElementById('r1');
  rows[0].forEach(k => {
    const el = makeKey(k, '');
    el.dataset.char = k;
    el.addEventListener('mousedown', e => { e.preventDefault(); pressKey(k, el); });
    r1.appendChild(el);
  });
  const bk = makeKey('⌫', 'wide special');
  bk.addEventListener('mousedown', e => { e.preventDefault(); del(); flash(bk); });
  r1.appendChild(bk);

  // Row 1: QWERTY
  const r2 = document.getElementById('r2');
  const tab = makeKey('Tab', 'wide special');
  tab.addEventListener('mousedown', e => { e.preventDefault(); flash(tab); });
  r2.appendChild(tab);
  rows[1].forEach(k => {
    const el = makeKey(k, '');
    el.dataset.char = k;
    el.addEventListener('mousedown', e => { e.preventDefault(); pressKey(k, el); });
    r2.appendChild(el);
  });

  // Row 2: ASDF + Enter
  const r3 = document.getElementById('r3');
  const caps = makeKey('Caps', 'wide special');
  caps.addEventListener('mousedown', e => { e.preventDefault(); flash(caps); });
  r3.appendChild(caps);
  rows[2].forEach(k => {
    const el = makeKey(k, '');
    el.dataset.char = k;
    el.addEventListener('mousedown', e => { e.preventDefault(); pressKey(k, el); });
    r3.appendChild(el);
  });
  const ent = makeKey('Enter ↵', 'xwide enter-key');
  ent.addEventListener('mousedown', e => { e.preventDefault(); go(); flash(ent); });
  r3.appendChild(ent);

  // Row 3: ZXCV + Shift
  const r4 = document.getElementById('r4');
  const sh1 = makeKey('⇧ Shift', 'xwide special shift-key');
  sh1.addEventListener('mousedown', e => { e.preventDefault(); toggleShift(); });
  r4.appendChild(sh1);
  rows[3].forEach(k => {
    const el = makeKey(k, '');
    el.dataset.char = k;
    el.addEventListener('mousedown', e => { e.preventDefault(); pressKey(k, el); });
    r4.appendChild(el);
  });
  const sh2 = makeKey('⇧ Shift', 'xwide special shift-key');
  sh2.addEventListener('mousedown', e => { e.preventDefault(); toggleShift(); });
  r4.appendChild(sh2);

  // Row 4: Space
  const r5 = document.getElementById('r5');
  const sp = makeKey('Space', 'space-key');
  sp.addEventListener('mousedown', e => { e.preventDefault(); typeChar(' '); flash(sp); });
  r5.appendChild(sp);
}

// Events
document.getElementById('btn-go').addEventListener('mousedown', e => { e.preventDefault(); go(); });
document.getElementById('btn-del').addEventListener('mousedown', e => { e.preventDefault(); del(); });
document.getElementById('btn-clr').addEventListener('mousedown', e => { e.preventDefault(); url = ''; renderDisplay(); });

document.querySelectorAll('.qbtn').forEach(b => {
  b.addEventListener('mousedown', e => {
    e.preventDefault();
    const v = b.dataset.val;
    if (v === 'www.' && url.startsWith('https://')) {
      url = 'https://www.' + url.slice(8);
    } else if (v === 'www.' && url.startsWith('http://')) {
      url = 'http://www.' + url.slice(7);
    } else {
      url += v;
    }
    renderDisplay();
  });
});

buildKeyboard();
renderDisplay();
