// Quick Exit — double-Esc or button/link navigates away and replaces history
(function () {
  var SAFE_URL = 'https://www.google.com/';
  var lastEsc = 0;

  function exit() {
    try { window.location.replace(SAFE_URL); } catch (e) {}
  }

  // Works with both <a> (no-JS fallback) and <button> elements
  var btn = document.getElementById('quickExitBtn');
  if (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      exit();
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var now = Date.now();
      if (now - lastEsc < 600) exit();
      lastEsc = now;
    }
  });
})();

// Mobile navigation — hamburger open/close (overlay is in the HTML, not injected)
(function () {
  var burger = document.querySelector('.nav-burger');
  var overlay = document.getElementById('mobile-nav');
  if (!burger || !overlay) return;

  // Wire up quick exit link in overlay (same replace behaviour)
  var overlayExit = overlay.querySelector('.mobile-nav__exit-link');
  if (overlayExit) {
    overlayExit.addEventListener('click', function (e) {
      e.preventDefault();
      try { window.location.replace('https://www.google.com/'); } catch (x) {}
    });
  }

  var isOpen = false;

  function openNav() {
    isOpen = true;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflow = 'hidden';
    var first = overlay.querySelector('a, button');
    if (first) first.focus();
  }

  function closeNav() {
    isOpen = false;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
    burger.focus();
  }

  burger.addEventListener('click', function () {
    if (isOpen) closeNav(); else openNav();
  });

  // Escape closes the overlay (double-Esc still triggers quick exit via the other handler)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeNav();
  });

  // Focus trap
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = Array.from(overlay.querySelectorAll('a[href], button:not([disabled])'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Close on nav link click (not the quick exit link)
  overlay.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (link && !link.classList.contains('mobile-nav__exit-link')) {
      closeNav();
    }
  });
})();

// Shared footer — injected into pages that include #footer-mount
(function () {
  var mount = document.getElementById('footer-mount');
  if (!mount) return;

  mount.outerHTML = [
    '<footer>',
    '  <div class="wrap">',
    '    <div class="crisis">',
    '      <div class="label">If you need help now</div>',
    '      <div class="crisis-body">',
    '        <h3>You don\'t have to be sure it\'s <em>coercive control</em> to call.</h3>',
    '        <div class="crisis-numbers">',
    '          <div class="crisis-num">',
    '            <span class="who">1800RESPECT</span>',
    '            <a class="number" href="tel:1800737732">1800 737 732</a>',
    '            <span class="help">National counselling, 24/7. Free, confidential.</span>',
    '          </div>',
    '          <div class="crisis-num">',
    '            <span class="who">In immediate danger</span>',
    '            <a class="number" href="tel:000">000</a>',
    '            <span class="help">Police &amp; ambulance.</span>',
    '          </div>',
    '          <div class="crisis-num">',
    '            <span class="who">Lifeline</span>',
    '            <a class="number" href="tel:131114">13 11 14</a>',
    '            <span class="help">Crisis support, 24/7.</span>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <div class="foot-cols">',
    '      <div class="foot-brand">',
    '        <div class="wordmark">',
    '          <span style="width:22px;height:42px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px" aria-hidden="true">',
    '            <img src="safe-call-up-logo.png" alt="" style="display:block;width:100%;height:100%;object-fit:contain"/>',
    '          </span>',
    '          Safe Call Up',
    '        </div>',
    '        <p>A quiet place to put down what has been hard to say out loud.</p>',
    '      </div>',
    '      <div>',
    '        <h5>Understand</h5>',
    '        <ul>',
    '          <li><a href="index.html#what">What is coercive control</a></li>',
    '          <li><a href="index.html#what">Recognising the pattern</a></li>',
    '          <li><a href="index.html#read">Stories &amp; reading</a></li>',
    '          <li><a href="faq.html">FAQ</a></li>',
    '        </ul>',
    '      </div>',
    '      <div>',
    '        <h5>Document</h5>',
    '        <ul>',
    '          <li><a href="evidence.html">How evidencing works</a></li>',
    '          <li><a href="evidence.html#privacy">Privacy &amp; safety</a></li>',
    '          <li><a href="evidence.html#legal">Working with police</a></li>',
    '          <li><a href="faq.html">For advocates</a></li>',
    '        </ul>',
    '      </div>',
    '      <div>',
    '        <h5>Safe Call Up</h5>',
    '        <ul>',
    '          <li><a href="about.html">About</a></li>',
    '          <li><a href="index.html#evidence">How it works</a></li>',
    '          <li><a href="#">Partners</a></li>',
    '          <li><a href="#contact">Contact</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '    <div class="foot-bottom">',
    '      <span>© Safe Call Up 2026 · Made on Wurundjeri Country</span>',
    '      <span class="privacy-note">',
    '        <span class="pulse" aria-hidden="true"></span>',
    '        Browsing privately? Computer history can be checked.',
    '        <a href="#" style="color:var(--ink);border-bottom:1px solid var(--ink-faint);text-decoration:none;margin-left:6px">How to clear it</a>',
    '      </span>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('\n');
})();
