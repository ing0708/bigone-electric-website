(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Image fallback: any <img> that fails to load gets a styled
     placeholder instead of a broken-image icon. Works together with the
     [data-label] + .img-fallback CSS rules and the inline onerror
     handlers already set in the HTML (kept here as a safety net for any
     image without an inline handler).
     --------------------------------------------------------------------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('img-fallback');
    });
  });

  /* ---------------------------------------------------------------------
     Nav: sticky background on scroll + mobile menu toggle
     --------------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function onScroll() {
    if (window.scrollY > 12) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero: product color switcher
     --------------------------------------------------------------------- */
  var COLORS = {
    amber: {
      word: 'AMBER',
      hex: '#F5A623',
      img: 'images/product-amber.png',
      alt: 'ไฟหมุนเตือนสัญญาณ Big One Electric สีเหลือง'
    },
    red: {
      word: 'RED',
      hex: '#E63946',
      img: 'images/product-red.png',
      alt: 'ไฟหมุนเตือนสัญญาณ Big One Electric สีแดง'
    },
    blue: {
      word: 'BLUE',
      hex: '#2E6FF2',
      img: 'images/product-blue.png',
      alt: 'ไฟหมุนเตือนสัญญาณ Big One Electric สีน้ำเงิน'
    },
    green: {
      word: 'GREEN',
      hex: '#34C77B',
      img: 'images/product-green.png',
      alt: 'ไฟหมุนเตือนสัญญาณ Big One Electric สีเขียว'
    }
  };
  var ORDER = ['amber', 'red', 'blue', 'green'];
  var TRANSITION_MS = 700;

  var heroWord = document.getElementById('heroWord');
  var heroProduct = document.getElementById('heroProduct');
  var swatches = document.getElementById('heroSwatches');
  var root = document.documentElement;

  var currentColor = 'amber';
  var isAnimating = false;
  var activeImg = document.getElementById('heroProductImg');

  function applyColor(colorKey) {
    if (isAnimating || colorKey === currentColor || !COLORS[colorKey]) return;
    var state = COLORS[colorKey];
    var oldIndex = ORDER.indexOf(currentColor);
    var newIndex = ORDER.indexOf(colorKey);
    var forward = newIndex > oldIndex;
    var leavingClass = forward ? 'is-leaving-left' : 'is-leaving-right';
    var startClass = forward ? 'is-entering-right' : 'is-entering-left';

    isAnimating = true;

    // Headline + accent color + glow update immediately; CSS transitions
    // the color smoothly via the animatable --accent custom property.
    root.style.setProperty('--accent', state.hex);
    heroWord.textContent = state.word;

    // Idle float and the leave/enter transform both animate `transform`,
    // so the float animation is paused for the outgoing image and only
    // resumed on the new active image once the swap settles.
    activeImg.classList.remove('is-floating');
    activeImg.classList.add(leavingClass);

    // Incoming product image is created off-screen, then released on the
    // next frame so the browser animates it into place.
    var nextImg = document.createElement('img');
    nextImg.src = state.img;
    nextImg.alt = state.alt;
    nextImg.className = startClass;
    nextImg.addEventListener('error', function () {
      nextImg.classList.add('img-fallback');
    });
    heroProduct.appendChild(nextImg);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        nextImg.classList.remove(startClass);
      });
    });

    window.setTimeout(function () {
      if (activeImg && activeImg.parentNode) {
        activeImg.parentNode.removeChild(activeImg);
      }
      nextImg.id = 'heroProductImg';
      nextImg.classList.add('is-floating');
      activeImg = nextImg;
      currentColor = colorKey;
      isAnimating = false;
    }, TRANSITION_MS);

    swatches.querySelectorAll('.swatch').forEach(function (btn) {
      var isActive = btn.getAttribute('data-color') === colorKey;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  /* ---------------------------------------------------------------------
     Auto-cycle: if the user hasn't picked a color within AUTO_START_DELAY,
     cycle through the palette on a timer. Any manual swatch click stops
     it for good — it never resumes for the rest of the session.
     --------------------------------------------------------------------- */
  var AUTO_START_DELAY = 5000;
  var AUTO_CYCLE_INTERVAL = 4500;
  var autoCycleTimer = null;
  var autoCycleActive = true;

  function scheduleAutoCycle(delay) {
    autoCycleTimer = window.setTimeout(function () {
      if (!autoCycleActive) return;
      var nextIndex = (ORDER.indexOf(currentColor) + 1) % ORDER.length;
      applyColor(ORDER[nextIndex]);
      scheduleAutoCycle(AUTO_CYCLE_INTERVAL);
    }, delay);
  }

  function stopAutoCycle() {
    autoCycleActive = false;
    window.clearTimeout(autoCycleTimer);
  }

  if (swatches) {
    swatches.querySelectorAll('.swatch').forEach(function (btn) {
      btn.addEventListener('click', function () {
        stopAutoCycle();
        applyColor(btn.getAttribute('data-color'));
      });
    });
  }

  scheduleAutoCycle(AUTO_START_DELAY);

  /* ---------------------------------------------------------------------
     Hero: mouse parallax on background layers (ring + ghost cluster
     only). The main product stays put so it doesn't fight the idle
     float / color-swap transforms. Skipped entirely on touch devices.
     --------------------------------------------------------------------- */
  var heroSection = document.getElementById('hero');
  var heroRingEl = heroSection ? heroSection.querySelector('.hero-ring') : null;
  var heroGhostEl = document.getElementById('heroGhost');
  var PARALLAX_MAX = 15;

  if (heroSection && heroRingEl && heroGhostEl && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      var px = relX * 2 * PARALLAX_MAX;
      var py = relY * 2 * PARALLAX_MAX;
      heroRingEl.style.transform = 'translate(calc(-50% + ' + px + 'px), calc(-50% + ' + py + 'px))';
      heroGhostEl.style.transform = 'translate(' + px * 0.6 + 'px, ' + py * 0.6 + 'px)';
    });
    heroSection.addEventListener('mouseleave', function () {
      heroRingEl.style.transform = 'translate(-50%, -50%)';
      heroGhostEl.style.transform = 'translate(0, 0)';
    });
  }
})();
