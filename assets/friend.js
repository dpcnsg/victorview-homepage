/* 친구에게 보내는 선물 상자 (2026-11-03 시장 "누구에게 무슨 책을 추천하는지, 무료 책과 추천 책 구매 바로가기").
   주소: gift.html?ref=VVxxxx&book=blue#f=보낸이&t=받는이  /  보내기 화면: gift.html?send=1&ref=VVxxxx
   이름은 # 뒤에만 담아 서버로 가지 않는다. 책은 아래 목록에 있는 것만, 이름은 글자·숫자·빈칸 12자까지 받는다. */
(function () {
  var BOOKS = [
    ['suneung', '수능 전날 밤, 부모가 쓰는 편지 한 장', 'X3EyN', '3.99', '18'],
    ['blue', '세네카 블루 · 나의 시간', '4XR9p', '6.99', '01'],
    ['red', '세네카 레드 · 잠시 멈춤', 'HPno2', '6.99', '02'],
    ['purple', '세네카 퍼플 · 일곱 밤의 편지', 'fWo17', '3.99', '03'],
    ['green', '세네카 그린 · 어머니, 저는 괜찮습니다', 'tmQrG', '3.99', '04'],
    ['gold1', '세네카 골드 · 124일의 답장 1권', 'buy1t', '4.99', '05'],
    ['goldall', '세네카 골드 · 124일의 답장 합본', 'dYzBr', '11.99', '09'],
    ['plinyall', '플리니우스 완결본 · 그날, 삼촌은 배를 띄웠다', 'MeR5l', '10.99', '14'],
    ['adams', '애덤스 부부 · 나의 가장 사랑스러운 벗에게', '7V4tg', '10.99', '15'],
    ['lincoln', '링컨 · 일하는 것만이 치료다', 'Vs3Av', '11.99', '17']
  ];
  function $(id) { return document.getElementById(id); }
  function book(id) { return BOOKS.filter(function (b) { return b[0] === id; })[0] || null; }
  function clean(v) { return String(v || '').replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 12); }
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = new URLSearchParams(location.search);
  var hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  var raw = String(q.get('ref') || '').trim().toUpperCase();
  var ended = Date.now() >= Date.UTC(2027, 0, 31, 15);
  var ref = !ended && /^VV[A-Z0-9]{4}$/.test(raw) ? raw : '';

  function copy(text, done) {
    function fallback() {
      var t = document.createElement('textarea');
      t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(true); } catch (e) { done(false); }
      t.remove();
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  }

  /* 보내기 화면 */
  if (q.get('send')) {
    $('fr-receive').hidden = true;
    $('fr-send').hidden = false;
    document.title = '친구에게 선물 상자 보내기 | victorview';
    var sel = $('s-book');
    BOOKS.forEach(function (b) {
      var o = document.createElement('option');
      o.value = b[0]; o.textContent = b[1];
      sel.appendChild(o);
    });
    if (book(q.get('book'))) sel.value = q.get('book');
    if (!ref) {
      $('s-nocode').hidden = false;
      $('s-share').disabled = true; $('s-copy').disabled = true;
    }
    var build = function () {
      var f = clean($('s-from').value), t = clean($('s-to').value), b = book(sel.value);
      var u = location.origin + location.pathname + '?ref=' + encodeURIComponent(ref) + '&book=' + b[0];
      var h = [];
      if (f) h.push('f=' + encodeURIComponent(f));
      if (t) h.push('t=' + encodeURIComponent(t));
      if (h.length) u += '#' + h.join('&');
      var text = '[광고·추천 보상] 이 코드로 구매하시면 저에게 책 쿠폰으로 바꿀 수 있는 적립액이 생깁니다. 교환 조건과 한도가 있습니다. 자세한 조건: ' + location.origin + '/#event\n\n' +
        (t ? t + ' 님, ' : '') + (f ? f + ' 님이 ' : '') + '선물 상자를 보냈어요.\n추천하는 책: 『' + b[1].split(' · ').pop() + '』\n\n상자를 열면 무료 책 『일곱 날의 시간』과 추천 책 구매 바로가기, 10% 할인 코드가 들어 있어요. 추천 책은 따로 구매합니다.\n' + u;
      return { text: text, url: u, title: '선물 상자가 도착했습니다' };
    };
    var ready = function () {
      var m = build();
      $('s-preview').textContent = m.text;
      return m;
    };
    ['s-from', 's-to', 's-book'].forEach(function (id) { $(id).addEventListener('input', ready); });
    ready();
    var need = function () {
      if (clean($('s-to').value) && clean($('s-from').value)) return true;
      $('s-msg').textContent = '내 이름과 받는 친구 이름을 적어 주세요.';
      (clean($('s-from').value) ? $('s-to') : $('s-from')).focus();
      return false;
    };
    $('s-copy').addEventListener('click', function () {
      if (!need()) return;
      copy(ready().text, function (ok) { $('s-msg').textContent = ok ? '메시지를 복사했습니다. 카카오톡 대화창에 붙여 넣어 보내 주세요.' : '복사하지 못했습니다. 위 메시지를 직접 선택해 복사해 주세요.'; });
    });
    $('s-share').addEventListener('click', function () {
      if (!need()) return;
      var m = ready();
      if (navigator.share) {
        navigator.share({ title: m.title, text: m.text }).catch(function () {});
      } else {
        copy(m.text, function (ok) { $('s-msg').textContent = ok ? '이 기기는 바로 보내기를 지원하지 않아 메시지를 복사했습니다. 카카오톡 대화창에 붙여 넣어 보내 주세요.' : '복사하지 못했습니다. 위 메시지를 직접 선택해 복사해 주세요.'; });
      }
    });
    return;
  }

  /* 받는 화면 */
  var from = clean(hash.get('f')), to = clean(hash.get('t')), chosen = book(q.get('book'));
  var head = (to ? to + ' 님, ' : '') + (from ? from + ' 님이' : '친구가') + ' 보낸 선물 상자가 도착했습니다';
  $('fr-title').textContent = head;
  document.title = head + ' | victorview';
  if (!ref) $('fr-ad').hidden = true;
  $('fr-lead').textContent = chosen
    ? '상자를 열면 무료 책 『일곱 날의 시간』, ' + (from ? from + ' 님' : '친구') + '이 추천하는 책 『' + chosen[1].split(' · ').pop() + '』의 구매 바로가기' + (ref ? ', 10% 할인 코드' : '') + '가 들어 있습니다. 추천 책은 따로 구매합니다.'
    : '상자를 열면 무료 책 『일곱 날의 시간』' + (ref ? '과 10% 할인 코드가' : '이') + ' 들어 있습니다.';
  if (chosen) {
    $('fr-book').hidden = false;
    $('fr-book-img').src = 'covers/ko/' + chosen[4] + '.jpg';
    $('fr-book-img').alt = '『' + chosen[1].split(' · ').pop() + '』 표지';
    $('fr-book-tag').textContent = (from ? from + ' 님' : '친구') + '이 추천하는 책';
    $('fr-book-title').textContent = chosen[1];
    $('fr-book-price').textContent = 'US$' + chosen[3] + ' · Payhip' + (ref ? ', 코드를 넣으면 10% 할인' : '');
    $('fr-book-go').href = 'https://payhip.com/b/' + chosen[2];
  }
  if (ref) {
    $('fr-code').hidden = false;
    $('fr-code-val').textContent = ref;
    $('fr-free').href = 'free-seven-days.html?ref=' + encodeURIComponent(ref);
    $('fr-copy').addEventListener('click', function () {
      var btn = $('fr-copy');
      copy(ref, function (ok) { btn.textContent = ok ? '복사했습니다' : '직접 적어 주세요'; });
    });
  }

  var rib = '#E8C36A', c = '#931B1C', lid = '#AB2425';
  var svg = '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><circle class="gift-glow" cx="100" cy="72" r="66" fill="#FFE29A"/>' +
    '<g class="gift-letter"><rect x="58" y="62" width="84" height="58" rx="3" fill="#FBF7EE" stroke="#C9B98F"/><path d="M58 64 100 94 142 64" fill="none" stroke="#C9B98F" stroke-width="2"/><circle cx="100" cy="93" r="10" fill="#A92D1B"/><circle cx="100" cy="93" r="6" fill="none" stroke="#E9A594" stroke-width="1.4"/></g>' +
    '<rect x="18" y="70" width="164" height="122" rx="6" fill="' + c + '"/><rect x="18" y="70" width="164" height="12" fill="#000" opacity=".22"/><rect x="150" y="70" width="32" height="122" rx="6" fill="#000" opacity=".14"/><rect x="89" y="70" width="22" height="122" fill="' + rib + '"/>' +
    '<g class="gift-lid"><rect x="8" y="42" width="184" height="36" rx="6" fill="' + lid + '"/><rect x="89" y="42" width="22" height="36" fill="' + rib + '"/><path d="M100 42C74 8 40 14 52 32c6 9 28 12 48 10ZM100 42c26-34 60-28 48-10-6 9-28 12-48 10Z" fill="' + rib + '"/><rect x="90" y="30" width="20" height="17" rx="5" fill="' + rib + '"/></g></svg>';
  var box = document.createElement('button');
  box.type = 'button';
  box.className = 'gift-box';
  box.setAttribute('aria-label', '선물 상자 열기');
  box.innerHTML = svg;
  $('fr-boxwrap').appendChild(box);

  function burst() {
    if (still) return;
    var stage = $('fr'), fx = stage.querySelector('.gift-fx');
    var s = stage.getBoundingClientRect(), r = box.getBoundingClientRect();
    var hues = ['#FFE29A', '#E8C36A', '#FBF7EE', '#E2573F', '#1C3C85', '#4A2E85'];
    for (var n = 0; n < 40; n++) {
      var p = document.createElement('i');
      p.className = 'gift-bit gift-bit-' + (n % 3);
      p.style.background = hues[n % hues.length];
      p.style.left = (r.left - s.left + r.width / 2) + 'px';
      p.style.top = (r.top - s.top + r.height * 0.3) + 'px';
      fx.appendChild(p);
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.6, d = 90 + Math.random() * 230;
      var dx = Math.cos(a) * d, dy = Math.sin(a) * d;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) rotate(' + Math.random() * 360 + 'deg)', opacity: 1, offset: 0.55 },
        { transform: 'translate(calc(-50% + ' + dx * 1.15 + 'px),calc(-50% + ' + (dy + 160) + 'px)) rotate(' + Math.random() * 720 + 'deg)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.15,.7,.35,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }
  var done = false;
  function open() {
    if (done) return;
    done = true;
    box.classList.add('is-open');
    box.setAttribute('aria-label', '열린 선물 상자');
    burst();
    $('fr-open').hidden = true;
    $('fr-gifts').hidden = false;
    if (!still && $('fr-gifts').animate) $('fr-gifts').animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'ease-out' });
    setTimeout(function () { $('fr-gifts').scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'nearest' }); }, 500);
  }
  box.addEventListener('click', open);
  $('fr-open').addEventListener('click', open);
})();
