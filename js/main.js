(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ── Theme toggle (follows the system until the visitor picks one) ──
  var toggle = document.getElementById("theme-toggle");
  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  toggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ── Mobile menu ──
  var menuBtn = document.getElementById("menu-btn");
  var links = document.getElementById("nav-links");
  function setMenu(open) {
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // ── Scroll: header border, progress bar, timeline line ──
  var header = document.querySelector(".site-header");
  var bar = document.getElementById("progress");
  var timeline = document.getElementById("timeline");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.7 - r.top) / r.height;
      timeline.style.setProperty("--tl", Math.max(0, Math.min(1, p)).toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  // ── Reveal on scroll ──
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ── Nav highlight for the section in view ──
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // ── Typewriter roles ──
  var typed = document.getElementById("typed");
  var roles = ["Software Engineer", "Co-op Developer", "Power Platform Builder", "Full-Stack Developer", "DJ on the Weekends"];
  if (typed && !reduce) {
    var ri = 0, ci = roles[0].length, deleting = false;
    (function tick() {
      var word = roles[ri];
      if (!deleting) {
        ci++;
        typed.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; return setTimeout(tick, 1700); }
        return setTimeout(tick, 70);
      }
      ci--;
      typed.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(tick, 300); }
      setTimeout(tick, 34);
    })();
  }

  // ── Count-up numbers ──
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  // ── Cursor spotlight on cards, and gentle 3D tilt on project cards ──
  if (finePointer && !reduce) {
    document.querySelectorAll(".spotlight").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });

    // Hero icons drift slightly with the mouse.
    var visual = document.querySelector(".hero-visual");
    var floats = document.querySelectorAll(".float");
    var hero = document.getElementById("hero");
    if (visual && hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        floats.forEach(function (f, i) {
          var depth = (i % 3 + 1) * 6;
          f.style.translate = (x * depth).toFixed(1) + "px " + (y * depth).toFixed(1) + "px";
        });
      });
    }
  }

  // Experience: the button opens and closes the bullet points.
  document.querySelectorAll(".xp-toggle").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    var label = btn.querySelector(".xp-toggle-label");
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      label.textContent = open ? label.dataset.open : label.dataset.closed;
    });
  });

  // Touch screens have no hover, so the hint reads "Tap for details".
  if (!finePointer) document.querySelectorAll(".hint").forEach(function (h) { h.textContent = h.textContent.replace("Hover", "Tap"); });

  // ── Expandable cards: hover on desktop, tap or Enter/Space anywhere ──
  document.querySelectorAll(".expand").forEach(function (card) {
    var btn = card.querySelector(".expand-btn");
    function sync(hovering) {
      btn.setAttribute("aria-expanded", String(card.classList.contains("open") || hovering));
    }
    btn.addEventListener("click", function () {
      card.classList.toggle("open");
      sync(false);
    });
    if (finePointer) {
      card.addEventListener("pointerenter", function () { sync(true); });
      card.addEventListener("pointerleave", function () { sync(false); });
    }
  });

  // ── Copy email ──
  var copyBtn = document.getElementById("copy-email");
  var copied = document.getElementById("copied");
  var email = document.getElementById("email-link").textContent.trim();
  copyBtn.addEventListener("click", function () {
    function done(ok) {
      copied.textContent = ok ? "Email copied to clipboard." : "Copy failed. The address is " + email;
      setTimeout(function () { copied.textContent = ""; }, 2500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
    } else { done(false); }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
