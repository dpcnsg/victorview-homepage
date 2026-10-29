/* 위·아래 바로가기 단추 (2026-10-29 시장): 오른쪽 아래에 맨 위로 ▲ / 맨 아래로 ▼. 조금 내려오면 나타난다. */
(function () {
  var ko = /^ko/.test(document.documentElement.lang || '');
  var css = '.vv-jump{position:fixed;right:16px;bottom:20px;z-index:50;display:flex;flex-direction:column;gap:8px;opacity:0;pointer-events:none;transition:opacity .2s}' +
    '.vv-jump.on{opacity:1;pointer-events:auto}' +
    '.vv-jump button{width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,0,0,.12);background:rgba(255,255,255,.94);color:#2B2B2B;font-size:18px;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.12)}' +
    '.vv-jump button:hover,.vv-jump button:focus-visible{background:#B4432F;color:#fff;outline:none}' +
    '@media print{.vv-jump{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement('div'); box.className = 'vv-jump';
  box.innerHTML = '<button type="button" data-to="top" aria-label="' + (ko ? '맨 위로' : 'Back to top') + '">▲</button>' +
    '<button type="button" data-to="end" aria-label="' + (ko ? '맨 아래로' : 'Go to bottom') + '">▼</button>';
  document.body.appendChild(box);
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    window.scrollTo({ top: b.dataset.to === 'top' ? 0 : document.documentElement.scrollHeight, behavior: 'smooth' });
  });
  var tick = function () { box.classList.toggle('on', window.scrollY > 300); };
  window.addEventListener('scroll', tick, { passive: true }); tick();
})();
