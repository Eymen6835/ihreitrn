
(function () {
  var d = document.documentElement;
  d.className += ' js';
  var t = null;
  try { t = localStorage.getItem('iirn-theme'); } catch (e) {  }
  if (t !== 'dark') t = 'light';
  d.setAttribute('data-theme', t);
  if (t === 'dark') {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = '#0b111b';
  }

  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var neuGeladen = nav && nav.type === 'reload';
    if (!neuGeladen && document.referrer && new URL(document.referrer).host === location.host) d.className += ' kopf-ruhig';
  } catch (e) {  }
})();
