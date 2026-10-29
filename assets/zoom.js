/* 책 속 미리보기 (2026-10-29 시장): 책을 누르면 속지 샘플을 크게 넘겨 본다.
   <figure data-pages="a.jpg|b.jpg"> 이면 그 쪽들을, 없으면 figure 안 그림 한 장을 크게. ×·바깥·Esc로 닫고, ‹ ›·좌우 화살표로 넘긴다. */
(function () {
  var ko = /^ko/.test(document.documentElement.lang || '');
  var L = ko ? { close: '닫기', prev: '이전 쪽', next: '다음 쪽', sample: '샘플' } : { close: 'Close', prev: 'Previous page', next: 'Next page', sample: 'Sample' };
  var css = '.vv-zoom{position:fixed;inset:0;z-index:60;background:rgba(20,20,20,.85);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.vv-zoom img{max-width:min(92vw,760px);max-height:84vh;width:auto;height:auto;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,.4);background:#fff}' +
    '.vv-zoom p{position:absolute;left:0;right:0;bottom:14px;text-align:center;color:#fff;font-size:14px;margin:0}' +
    '.vv-zoom button{position:absolute;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#2B2B2B;font-size:22px;line-height:1;cursor:pointer}' +
    '.vv-zoom .x{top:12px;right:12px}.vv-zoom .pv{left:12px;top:50%;margin-top:-22px}.vv-zoom .nx{right:12px;top:50%;margin-top:-22px}' +
    '.vv-zoom button:hover,.vv-zoom button:focus-visible{background:#B4432F;color:#fff;outline:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = null, pages = [], at = 0, title = '', back = null;
  function show() {
    box.querySelector('img').src = pages[at];
    box.querySelector('img').alt = title + ' · ' + L.sample + ' ' + (at + 1);
    box.querySelector('p').textContent = title + (pages.length > 1 ? '  ·  ' + (at + 1) + ' / ' + pages.length : '');
    box.querySelector('.pv').hidden = box.querySelector('.nx').hidden = pages.length < 2;
  }
  function close() { if (box) { box.remove(); box = null; document.body.style.overflow = ''; if (back) back.focus(); } }
  function go(d) { if (box && pages.length > 1) { at = (at + d + pages.length) % pages.length; show(); } }
  function open(fig) {
    var img = fig.querySelector('img');
    var prefix = (img.getAttribute('src') || '').replace(/covers\/.*$/, '');
    pages = fig.dataset.pages ? fig.dataset.pages.split('|').map(function (p) { return prefix + p; }) : [img.currentSrc || img.src];
    var cap = fig.querySelector('figcaption');
    title = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
    at = 0; back = fig;
    box = document.createElement('div');
    box.className = 'vv-zoom'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<img alt=""><p></p><button type="button" class="pv" aria-label="' + L.prev + '">‹</button>' +
      '<button type="button" class="nx" aria-label="' + L.next + '">›</button><button type="button" class="x" aria-label="' + L.close + '">×</button>';
    box.addEventListener('click', function (e) {
      if (e.target.closest('.pv')) return go(-1);
      if (e.target.closest('.nx')) return go(1);
      if (e.target.tagName !== 'IMG') close();
    });
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    show();
    box.querySelector('.x').focus();
  }
  document.addEventListener('click', function (e) {
    var fig = e.target.closest && e.target.closest('.peek figure');
    if (fig) open(fig);
  });
  document.addEventListener('keydown', function (e) {
    if (box) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      return;
    }
    var fig = e.target.closest && e.target.closest('.peek figure');
    if (fig && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(fig); }
  });
})();
