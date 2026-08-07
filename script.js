// ---------------------------------------------------------------------------
// Analytics — GoatCounter. Privacy-friendly: no cookies, no personal data, so
// no consent banner is required.
//
// TO SWITCH ON: register the site at https://www.goatcounter.com/ (free) and
// put the code you pick here. Until then this stays off and nothing loads.
const GOATCOUNTER_CODE = ""; // e.g. "aristotelisgkouvas"
// ---------------------------------------------------------------------------
(() => {
  if (!GOATCOUNTER_CODE) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(s);
})();

// Mobile menu
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  const close = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = !toggle.classList.contains("is-open");
    toggle.classList.toggle("is-open", open);
    links.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// Sticky header shadow on scroll
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Scroll-triggered reveals
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

// Active nav link based on visible section
(() => {
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (!navLinks.length) return;
  const sections = [...navLinks]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;
  const map = new Map(sections.map((s, i) => [s, navLinks[i]]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("is-active"));
          map.get(entry.target)?.classList.add("is-active");
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => io.observe(s));
})();

// Hover spotlight on work cards
(() => {
  const cards = document.querySelectorAll(".work-card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
})();

// Lightbox for project gallery
(() => {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML = `
    <img alt="" />
    <div class="lightbox-foot">
      <span class="caption mono"></span>
      <button class="lightbox-close" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="width:1em;height:1em;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Close · ESC
      </button>
    </div>`;
  document.body.appendChild(dlg);
  const dlgImg = dlg.querySelector("img");
  const dlgCap = dlg.querySelector(".caption");
  const close = () => dlg.close();
  dlg.querySelector(".lightbox-close").addEventListener("click", close);
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) close();
  });
  items.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      dlgImg.src = a.getAttribute("href");
      dlgImg.alt = a.dataset.caption || "";
      dlgCap.textContent = a.dataset.caption || "";
      dlg.showModal();
    });
  });
})();

// Rotating role text in hero
(() => {
  const el = document.querySelector("[data-roles]");
  if (!el) return;
  let roles;
  try { roles = JSON.parse(el.dataset.roles); } catch { return; }
  if (!Array.isArray(roles) || roles.length < 2) return;

  // The text swaps itself every few seconds. Announce it, and don't animate
  // at all for anyone who asked the OS to stop moving things.
  el.setAttribute("aria-live", "polite");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let i = 0;
  let timer;
  el.style.transition = "opacity 220ms ease";
  const tick = () => {
    el.style.opacity = "0";
    setTimeout(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.style.opacity = "1";
    }, 220);
  };
  const start = () => { timer ??= setInterval(tick, 2800); };
  const stop = () => { clearInterval(timer); timer = undefined; };
  // Pause while the tab is hidden — no point animating into an empty room.
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });
  start();
})();
