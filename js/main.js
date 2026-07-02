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

    // Outgoing product image slides/fades out.
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

  if (swatches) {
    swatches.querySelectorAll('.swatch').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyColor(btn.getAttribute('data-color'));
      });
    });
  }
})();
