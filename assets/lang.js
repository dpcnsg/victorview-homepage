// 언어 고르기: 바깥을 누르거나 Esc를 누르면 닫힘. 자동으로 다른 언어로 보내지 않음.
(function () {
  var picks = [].slice.call(document.querySelectorAll('details.lang-pick'));
  if (!picks.length) return;
  document.addEventListener('click', function (e) { picks.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') picks.forEach(function (d) { if (d.open) { d.open = false; d.querySelector('summary').focus(); } }); });
})();
