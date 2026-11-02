/* 오픈 기념 축하 (2026-10-29 시장 승인, Codex 지적 반영): 첫 방문 때 한 번, 약 2초, 은은한 종이 조각이 화면 양옆 가장자리로만 내려온다.
   - 같은 브라우저(같은 사이트 저장소)에서는 다시 뜨지 않는다. 표시는 그림이 실제로 시작된 뒤에만 남긴다. 출판사로 보내지 않는다.
   - '움직임 줄이기' 설정이면 뜨지 않고, 도중에 켜지면 멈춘다. 탭이 가려지면 지운다. 저장소를 쓸 수 없으면 띄우지 않는다.
   - 움직임은 실제 시간 기준(화면 주사율과 무관). 외부 라이브러리 없음, 클릭을 막지 않음. */
(function () {
  var KEY = 'vv-celebrated';
  var mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }
  try {
    if (reduced() || localStorage.getItem(KEY)) return;
    localStorage.setItem(KEY + '-t', '1'); localStorage.removeItem(KEY + '-t');   // 저장소를 쓸 수 있는지만 확인
  } catch (e) { return; }

  function start() {
    if (reduced() || document.hidden) return;
    var cv = document.createElement('canvas');
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    try { localStorage.setItem(KEY, '1'); } catch (e) { return; }
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60';
    document.body.appendChild(cv);
    var W, H, dpr;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    // 바탕 톤에 맞춘 색: 녹색·금·먹·종이, 다홍은 조금만
    var COLORS = ['#1E3A2F', '#B8955A', '#4A4F4C', '#D9CFBC', '#1E3A2F', '#B8955A', '#A92D1B'];
    var n = W < 600 ? 24 : 40, P = [];
    var edge = Math.min(W * 0.14, 160);              // 양옆 가장자리 폭: 본문·제목을 가리지 않게
    for (var i = 0; i < n; i++) {
      var left = i % 2 === 0;
      P.push({
        x: left ? Math.random() * edge : W - Math.random() * edge,
        y: -20 - Math.random() * H * 0.3,
        vx: (Math.random() - 0.5) * 30,               // 화면 픽셀/초
        vy: 120 + Math.random() * 160,
        w: 5 + Math.random() * 4, h: 3 + Math.random() * 3,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 6,
        c: COLORS[i % COLORS.length]
      });
    }
    var t0 = null, prev = null, DUR = 2000, done = false;
    function stop() {
      if (done) return; done = true;
      cv.remove();
      document.removeEventListener('visibilitychange', onVis);
      removeEventListener('resize', size);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onMq);
    }
    function onVis() { if (document.hidden) stop(); }
    function onMq() { if (reduced()) stop(); }
    document.addEventListener('visibilitychange', onVis);
    addEventListener('resize', size);
    if (mq && mq.addEventListener) mq.addEventListener('change', onMq);
    function frame(t) {
      if (done) return;
      if (t0 === null) { t0 = prev = t; }
      var k = (t - t0) / DUR, dt = Math.min((t - prev) / 1000, 0.05); prev = t;
      ctx.clearRect(0, 0, W, H);
      if (k >= 1) { stop(); return; }
      ctx.globalAlpha = 0.7 * (k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3);
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.vy += 60 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'complete') setTimeout(start, 400);
  else addEventListener('load', function () { setTimeout(start, 400); });
})();
