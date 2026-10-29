/* 책 속 미리보기 크게 보기 (2026-10-29 시장): 미리보기 쪽 그림을 누르면 화면 가득 크게, 바깥·닫기·Esc로 닫는다. */
(function () {
  var ko = /^ko/.test(document.documentElement.lang || '');
  var css = '.vv-zoom{position:fixed;inset:0;z-index:60;background:rgba(20,20,20,.82);display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out}' +
    '.vv-zoom img{max-width:min(92vw,760px);max-height:88vh;width:auto;height:auto;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,.4);background:#fff}' +
    '.vv-zoom p{position:absolute;left:0;right:0;bottom:16px;text-align:center;color:#fff;font-size:14px;margin:0}' +
    '.vv-zoom button{position:absolute;top:12px;right:12px;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#2B2B2B;font-size:22px;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var open = null;
  function close() { if (open) { open.remove(); open = null; document.body.style.overflow = ''; } }
  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.peek img');
    if (!img) return;
    var cap = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    open = document.createElement('div');
    open.className = 'vv-zoom'; open.setAttribute('role', 'dialog'); open.setAttribute('aria-modal', 'true');
    open.innerHTML = '<button type="button" aria-label="' + (ko ? '닫기' : 'Close') + '">×</button><img alt=""><p></p>';
    open.querySelector('img').src = img.currentSrc || img.src;
    open.querySelector('img').alt = img.alt;
    open.querySelector('p').textContent = cap ? cap.textContent : '';
    open.addEventListener('click', close);
    document.body.appendChild(open);
    document.body.style.overflow = 'hidden';
    open.querySelector('button').focus();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
