/* 무료책 "친구에게 보내기" 단추 (2026-10-29)
   휴대폰(터치 화면)에서는 기기 공유 창(카톡·문자·메일)을 열고, PC에서는 소개 한 줄과 주소를 복사한다.
   단추: <button class="share-btn" data-url data-title data-text data-done data-copy> */
(function () {
  var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.share-btn');
    if (!b) return;
    var url = b.dataset.url || location.href;
    var title = b.dataset.title || document.title;
    var text = b.dataset.text || '';
    if (touch && navigator.share) {
      navigator.share({ title: title, text: text, url: url }).catch(function () {});
      return;
    }
    var all = (text ? text + '\n' : '') + url;
    var done = function () {
      var old = b.textContent;
      b.textContent = b.dataset.done || 'Copied';
      setTimeout(function () { b.textContent = old; }, 2500);
    };
    var ask = function () { window.prompt(b.dataset.copy || 'Copy this link', all); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(all).then(done, ask);
    else ask();
  });
})();
