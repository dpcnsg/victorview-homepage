/* 오픈 기념 추천 이벤트 선물 상자 (2026-11-03 시장 지시). 다섯 상자는 세네카 다섯 책의 표지 색이다.
   - 상자를 누르면 뚜껑이 열리고 편지가 올라오며, 오른쪽 카드에 요약이 나온다. 조건 전문은 #event-detail 에 그대로 둔다.
   - 그림은 이 파일이 그리는 SVG뿐이다. 스크립트가 없으면 상자 없이 요약과 세부 내용이 모두 보인다. */
(function () {
  var stage = document.getElementById('gift-stage');
  var pile = document.getElementById('gift-pile');
  if (!stage || !pile) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BOXES = [
    { id: 'gold', name: '골드 상자', c: '#DEA357', lid: '#E9B86F', rib: '#A92D1B', art: 'dots' },
    { id: 'purple', name: '퍼플 상자', c: '#4A2E85', lid: '#5A3A9C', rib: '#E8C36A', art: 'stripe' },
    { id: 'green', name: '그린 상자', c: '#1C5D3D', lid: '#237049', rib: '#F3ECDD', art: 'dots' },
    { id: 'blue', name: '블루 상자', c: '#1C3C85', lid: '#25499C', rib: '#E8C36A', art: 'stripe' },
    { id: 'red', name: '레드 상자', c: '#931B1C', lid: '#AB2425', rib: '#F3ECDD', art: 'check' }
  ];

  function art(b) {
    var p = 'gift-pat-' + b.id;
    var inner = b.art === 'dots'
      ? '<circle cx="9" cy="9" r="2.4" fill="#fff" opacity=".2"/>'
      : b.art === 'stripe'
        ? '<rect width="6" height="18" fill="#fff" opacity=".1"/>'
        : '<rect width="9" height="9" fill="#fff" opacity=".09"/><rect x="9" y="9" width="9" height="9" fill="#fff" opacity=".09"/>';
    return '<defs><pattern id="' + p + '" width="18" height="18" patternUnits="userSpaceOnUse"' + (b.art === 'stripe' ? ' patternTransform="rotate(35)"' : '') + '>' + inner + '</pattern></defs>';
  }

  function svg(b) {
    return '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">' + art(b) +
      '<circle class="gift-glow" cx="100" cy="72" r="66" fill="#FFE29A"/>' +
      '<g class="gift-letter"><rect x="58" y="62" width="84" height="58" rx="3" fill="#FBF7EE" stroke="#C9B98F"/><path d="M58 64 100 94 142 64" fill="none" stroke="#C9B98F" stroke-width="2"/><circle cx="100" cy="93" r="10" fill="#A92D1B"/><circle cx="100" cy="93" r="6" fill="none" stroke="#E9A594" stroke-width="1.4"/></g>' +
      '<rect x="18" y="70" width="164" height="122" rx="6" fill="' + b.c + '"/><rect x="18" y="70" width="164" height="122" rx="6" fill="url(#gift-pat-' + b.id + ')"/>' +
      '<rect x="18" y="70" width="164" height="12" fill="#000" opacity=".22"/><rect x="150" y="70" width="32" height="122" rx="6" fill="#000" opacity=".14"/>' +
      '<rect x="89" y="70" width="22" height="122" fill="' + b.rib + '"/>' +
      '<g class="gift-lid"><rect x="8" y="42" width="184" height="36" rx="6" fill="' + b.lid + '"/><rect x="8" y="42" width="184" height="36" rx="6" fill="url(#gift-pat-' + b.id + ')"/><rect x="89" y="42" width="22" height="36" fill="' + b.rib + '"/>' +
      '<path d="M100 42C74 8 40 14 52 32c6 9 28 12 48 10ZM100 42c26-34 60-28 48-10-6 9-28 12-48 10Z" fill="' + b.rib + '"/><path d="M100 42C82 22 62 22 66 30c3 6 20 12 34 12ZM100 42c18-20 38-20 34-12-3 6-20 12-34 12Z" fill="#000" opacity=".16"/><rect x="90" y="30" width="20" height="17" rx="5" fill="' + b.rib + '"/></g></svg>';
  }

  var revealDetail = function () {};
  var opened = {};
  var cards = {};
  [].forEach.call(stage.querySelectorAll('.gift-card'), function (c) { cards[c.dataset.box] = c; });
  var intro = cards.intro;
  var count = stage.querySelector('.gift-count');
  var buttons = [];

  BOXES.forEach(function (b, i) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'gift-box gift-box-' + b.id;
    el.setAttribute('aria-pressed', 'false');
    el.setAttribute('aria-label', (stage.dataset.open || '선물 상자 열기') + ': ' + ((cards[b.id] && cards[b.id].querySelector('h3').textContent) || ''));
    el.innerHTML = svg(b);
    el.addEventListener('click', function () { open(b, el); });
    pile.appendChild(el);
    buttons.push(el);
    b.i = i;
  });

  // 요약 카드는 한 번에 하나만 보인다. 스크립트가 없으면 다섯 장 모두 보인다.
  stage.classList.add('gift-on');
  function show(id) {
    Object.keys(cards).forEach(function (k) { cards[k].hidden = k !== id; });
    var c = cards[id];
    if (c && !still && c.animate) c.animate([{ opacity: 0, transform: 'translateY(22px) rotate(-1.5deg) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.2,1.3,.4,1)' });
  }
  show('intro');

  function burst(from, color) {
    if (still || !stage.animate) return;
    var fx = stage.querySelector('.gift-fx');
    var s = stage.getBoundingClientRect();
    var r = from.getBoundingClientRect();
    var x = r.left - s.left + r.width / 2;
    var y = r.top - s.top + r.height * 0.32;
    var hues = ['#FFE29A', '#E8C36A', '#FBF7EE', '#E2573F', color];
    for (var n = 0; n < 34; n++) {
      var p = document.createElement('i');
      p.className = 'gift-bit gift-bit-' + (n % 3);
      p.style.background = hues[n % hues.length];
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      fx.appendChild(p);
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.5;
      var d = 90 + Math.random() * 220;
      var dx = Math.cos(a) * d;
      var dy = Math.sin(a) * d;
      var anim = p.animate([
        { transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(1) rotate(' + (Math.random() * 360) + 'deg)', opacity: 1, offset: 0.55 },
        { transform: 'translate(calc(-50% + ' + dx * 1.15 + 'px),calc(-50% + ' + (dy + 150) + 'px)) scale(.8) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.15,.7,.35,1)' });
      anim.onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }

  function open(b, el) {
    var first = !opened[b.id];
    opened[b.id] = true;
    el.classList.add('is-open');
    el.setAttribute('aria-pressed', 'true');
    buttons.forEach(function (x) { x.classList.toggle('is-current', x === el); });
    show(b.id);
    if (first) burst(el, b.c);
    var n = Object.keys(opened).length;
    if (count) {
      count.hidden = false;
      count.textContent = n < BOXES.length ? (stage.dataset.count || '다섯 상자 가운데 %n개를 열었습니다.').replace('%n', n) : (stage.dataset.done || '다섯 상자를 모두 여셨습니다. 아래에 세부 내용을 펼쳐 두었습니다.');
    }
    if (n === BOXES.length) { stage.classList.add('gift-all'); revealDetail(); }
    // 휴대폰에서는 카드가 상자 아래에 있으므로 카드를 화면 안으로 데려온다.
    var panel = stage.querySelector('.gift-panel');
    if (panel && window.innerWidth < 900) {
      var t = panel.getBoundingClientRect();
      if (t.bottom > window.innerHeight || t.top < 0) panel.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  // 아직 안 열린 상자 하나만 가끔 들썩인다. 화면에 보일 때만.
  if (!still) {
    var seen = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(stage);
    } else { seen = true; }
    var tick = 0;
    setInterval(function () {
      if (!seen || document.hidden) return;
      var rest = buttons.filter(function (x) { return !x.classList.contains('is-open'); });
      if (!rest.length) return;
      var e = rest[tick++ % rest.length];
      e.classList.remove('is-nudge');
      void e.offsetWidth;
      e.classList.add('is-nudge');
    }, 2400);
  }

  // 세부 내용은 숨겨 두고, 코드 받기를 누르거나 다섯 상자를 다 열었을 때, 세부 내용 단추를 눌렀을 때 연다(2026-11-03 시장 지시).
  var detail = document.getElementById('event-detail');
  var more = detail && detail.closest('.gift-more');
  function reveal() { if (more) more.hidden = false; if (detail) detail.open = true; }
  if (more) more.hidden = true;
  revealDetail = reveal;
  if (stage.classList.contains('gift-all')) reveal();
  [].forEach.call(document.querySelectorAll('a[href="#event-detail"], .gift-go'), function (a) { a.addEventListener('click', reveal); });
  if (location.hash === '#event-detail') reveal();
  // 카톡 채널은 글을 미리 넣어 열 수 없으므로 "추천 참여"를 복사해 두고 알려 준다.
  [].forEach.call(document.querySelectorAll('.gift-go[href*="pf.kakao.com"]'), function (a) {
    a.addEventListener('click', function () {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText('추천 참여').catch(function () {});
      if (count) { count.hidden = false; count.textContent = '“추천 참여”를 복사했습니다. 카카오톡 대화창에 붙여 넣어 보내 주세요.'; }
    });
  });
})();
