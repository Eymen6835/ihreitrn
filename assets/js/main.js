

(function () {
  'use strict';

  (function () {
    var portraet = document.querySelector('.portraet-hg');
    if (!portraet) return;

    function vorladen() {
      var bg = window.getComputedStyle(portraet).backgroundImage || '';
      var treffer = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (!treffer) return;
      var jetzt = treffer[1];
      var andere = jetzt.indexOf('portrait-hell') !== -1
        ? jetzt.replace('portrait-hell', 'portrait-dunkel')
        : jetzt.replace('portrait-dunkel', 'portrait-hell');
      if (andere === jetzt) return;
      var bild = new Image();
      if ('fetchPriority' in bild) { bild.fetchPriority = 'low'; }
      bild.decoding = 'async';
      bild.src = andere;
    }

    vorladen();
  })();

  var STORAGE_KEY = 'iirn-theme';
  var toggle = document.querySelector('.theme-toggle');
  var wechselZeit = 0;

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function currentTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set === 'dark' || set === 'light') return set;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function describeToggle() {
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'hellen' : 'dunklen';
    toggle.setAttribute('aria-label', 'Zur ' + next + ' Darstellung wechseln');
    toggle.setAttribute('title', 'Zur ' + next + ' Darstellung wechseln');
  }

  if (toggle) {
    describeToggle();

    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      var root = document.documentElement;
      root.classList.add('thema-wechsel');
      window.clearTimeout(wechselZeit);
      wechselZeit = window.setTimeout(function () { root.classList.remove('thema-wechsel'); }, 250);
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {  }
      faerbeLeiste();
      describeToggle();
    });

    var scheme = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function () {
      var stored = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {  }
      if (!stored) describeToggle();
    };

    if (typeof scheme.addEventListener === 'function') {
      scheme.addEventListener('change', onScheme);
    } else if (typeof scheme.addListener === 'function') {
      scheme.addListener(onScheme);
    }
  }

  var leiste = document.querySelector('meta[name="theme-color"]');
  var kopf = document.querySelector('.header');
  var fuss = document.querySelector('.footer');

  function faerbeLeiste() {
    if (!leiste) return;
    var farbe = currentTheme() === 'dark' ? '#0b111b' : '#fbfaf7';
    if (farbe === '#fbfaf7' && kopf && fuss &&
        fuss.getBoundingClientRect().top < kopf.getBoundingClientRect().bottom) {
      farbe = '#7d8999';
    }
    if (leiste.getAttribute('content') !== farbe) leiste.setAttribute('content', farbe);
  }

  window.addEventListener('scroll', faerbeLeiste, { passive: true });
  window.addEventListener('resize', faerbeLeiste);
  faerbeLeiste();

  function glasAn() {
    var setzen = function () { document.documentElement.classList.add('glas-bereit'); };
    window.requestAnimationFrame(function () { window.requestAnimationFrame(setzen); });
    window.setTimeout(setzen, 400); // falls der Browser keine Bilder zeichnet
  }
  if (document.readyState === 'complete') glasAn();
  else window.addEventListener('load', glasAn);

  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobile-nav');

  var nebenan = null;

  function nebenanAusblenden(offen) {
    if (!nebenan) {
      nebenan = [
        document.querySelector('.skip-link'),
        document.querySelector('.header .brand'),
        document.querySelector('.header .nav'),
        document.querySelector('.header__cta'),
        document.getElementById('main'),
        document.querySelector('.footer'),
        document.querySelector('.callbar')
      ].filter(Boolean);
    }
    nebenan.forEach(function (el) {
      if (offen) { el.setAttribute('inert', ''); } else { el.removeAttribute('inert'); }
    });
  }

  var FOKUSSIERBAR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function fokusKette() {
    var kette = [burger];
    var schalter = document.querySelector('.header .theme-toggle');
    if (schalter && schalter.offsetWidth) kette.push(schalter);
    Array.prototype.push.apply(kette, mobileNav.querySelectorAll(FOKUSSIERBAR));
    return kette;
  }

  function setzeMenue(offen) {
    if (!burger || !mobileNav) return;
    if (offen) {
      var breite = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sb', breite + 'px');
    }
    burger.setAttribute('aria-expanded', String(offen));
    mobileNav.classList.toggle('is-open', offen);
    document.body.classList.toggle('is-locked', offen);
    nebenanAusblenden(offen);
    if (!offen) document.documentElement.style.removeProperty('--sb');

    if (offen) {
      var erster = mobileNav.querySelector(FOKUSSIERBAR);
      if (erster) erster.focus();
    }
  }

  function closeMenu() {
    setzeMenue(false);
  }

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      setzeMenue(burger.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.addEventListener('click', function (event) {
      if (event.target === mobileNav || event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (burger.getAttribute('aria-expanded') !== 'true') return;

      if (event.key === 'Escape') {
        closeMenu();
        burger.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      var kette = fokusKette();
      if (!kette.length) return;

      var erster = kette[0];
      var letzter = kette[kette.length - 1];
      var aktiv = document.activeElement;
      var drinnen = aktiv === burger || mobileNav.contains(aktiv);

      if (!drinnen) {
        (event.shiftKey ? letzter : erster).focus();
        event.preventDefault();
      } else if (event.shiftKey && aktiv === erster) {
        letzter.focus();
        event.preventDefault();
      } else if (!event.shiftKey && aktiv === letzter) {
        erster.focus();
        event.preventDefault();
      }
    });

    var desktop = window.matchMedia('(min-width: 84em)');
    var onBreakpoint = function (event) { if (event.matches) closeMenu(); };

    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onBreakpoint);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onBreakpoint);
    }
  }

  var header = document.querySelector('.header');

  if (header) {
    var ticking = false;

    var updateHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.karte'), function (karte) {
    var info = karte.querySelector('.karte__info');
    var aktiv = null;

    function waehle(el) {
      if (aktiv) {
        aktiv.classList.remove('ist-aktiv');
        aktiv.setAttribute('aria-pressed', 'false');
      }
      if (!el || el === aktiv) {
        aktiv = null;
        karte.removeAttribute('data-aktiv');
        if (info) info.textContent = info.getAttribute('data-standard');
        return;
      }
      aktiv = el;
      el.classList.add('ist-aktiv');
      el.setAttribute('aria-pressed', 'true');
      karte.setAttribute('data-aktiv', el.getAttribute('data-zone'));
      if (info) info.textContent = el.getAttribute('data-info');
    }

    karte.addEventListener('click', function (event) {
      waehle(event.target.closest('[data-info]'));
    });

    karte.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var el = event.target.closest('[data-info]');
      if (!el) return;
      event.preventDefault();
      waehle(el);
    });
  });

  var revealTargets = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!revealTargets.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealTargets, function (element) {
      element.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

  Array.prototype.forEach.call(revealTargets, function (element) {
    observer.observe(element);
  });

  if (window.location.protocol === 'file:') {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || /^(https?:|tel:|mailto:|#|javascript:)/i.test(href)) return;
      var parts = href.split('#');
      var path = parts[0].replace(/^(\.\/|\/)+|\/+$/g, '');
      var hash = parts[1] ? '#' + parts[1] : '';
      var file = (path === '' ? 'index.html' : (path.endsWith('.html') ? path : path + '.html')) + hash;
      var baseDir = window.location.href.replace(/\/[^/]*$/, '/');
      event.preventDefault();
      window.location.href = baseDir + file;
    });
  }
})();
