/* 추천 코드 (2026-10-29, Codex 지적 반영): 추천 주소의 ?ref=VVxxxx 를 읽어 이 브라우저의 사이트 저장소에만 둔다. 서버로 보내는 코드는 없다.
   - 형식: VV + 영문 대문자·숫자 4자. 형식이 틀린 ref가 오면 이번 방문에는 아무 코드도 보이지 않는다.
   - 저장에 실패하면 지금 화면에서만 보인다. 이벤트 끝(2027-01-15 00:00 UTC) 뒤에는 지우고 보이지 않는다.
   - .refnote 칸이 있는 쪽(무료 워크북)에서만 글을 보여 준다. 홈에서는 저장만 해 무료 워크북으로 이어 준다. */
(function () {
  var K = 'vv-ref', END = Date.UTC(2027, 0, 15), OK = /^VV[A-Z0-9]{4}$/;
  var code = null, saved = false;
  if (Date.now() >= END) { try { localStorage.removeItem(K); } catch (e) {} return; }
  var vals = [];
  try { vals = new URLSearchParams(location.search).getAll('ref'); } catch (e) {}
  if (vals.length) {
    var v = vals.length === 1 ? String(vals[0]).trim().toUpperCase() : '';
    if (!OK.test(v)) return;                       // 빈 값·중복·형식 틀림: 표시하지 않음
    code = v;
    try { localStorage.setItem(K, code); saved = localStorage.getItem(K) === code; } catch (e) {}
  } else {
    try { var s = localStorage.getItem(K); if (s && OK.test(s)) { code = s; saved = true; } } catch (e) {}
  }
  if (!code) return;
  var msg = '입력된 추천 코드 ' + code + ' — Payhip에서 한글판을 살 때 결제 화면의 쿠폰 칸에 넣어 주세요. 이벤트 기간(2026년 11월 2일~2027년 1월 31일)에 10% 할인되며, 적용 여부는 결제 화면에서 확인할 수 있습니다.' +
    (saved ? '' : ' (이 브라우저에 저장되지 않아 지금 화면에서만 보입니다)');
  function show() {
    [].forEach.call(document.querySelectorAll('.refnote'), function (el) { el.textContent = msg; el.hidden = false; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
