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

// ---------------------------------------------------------------------------
// WhatsApp — leave empty and the button stays hidden. International format,
// e.g. "+30 69x xxx xxxx"; only the digits are used for the link.
const PHONE = "";
// ---------------------------------------------------------------------------
(() => {
  const a = document.getElementById("wa-link");
  if (!a) return;
  const digits = PHONE.replace(/\D/g, "");
  if (digits.length < 8) return;
  a.href = "https://wa.me/" + digits;
  a.textContent = "WhatsApp · " + PHONE;
  a.hidden = false;
})();

// Mobile menu
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  const isOpen = () => toggle.classList.contains("is-open");

  const setState = (open) => {
    toggle.classList.toggle("is-open", open);
    links.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    // The label has to describe what the button will DO next, otherwise a
    // screen-reader user is told "open menu" on an already-open menu.
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const close = ({ restoreFocus = false } = {}) => {
    if (!isOpen()) return;
    setState(false);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const open = !isOpen();
    setState(open);
    if (open) links.querySelector("a")?.focus();
  });

  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      close({ restoreFocus: true });
      return;
    }
    // Keep Tab inside the open panel — it covers the whole viewport, so
    // tabbing out lands on controls the user cannot see.
    if (e.key !== "Tab") return;
    const stops = [toggle, ...links.querySelectorAll("a")];
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Resizing past the breakpoint leaves the panel open but un-styled.
  const mq = window.matchMedia("(max-width: 720px)");
  mq.addEventListener("change", (e) => {
    if (!e.matches) close();
  });
})();

// Copy e-mail to clipboard — a mailto: link does nothing on a locked-down
// corporate desktop with no mail client configured.
(() => {
  const btn = document.querySelector(".copy-email");
  if (!btn) return;
  const label = btn.querySelector(".copy-label");
  const address = btn.dataset.email;
  if (!address) return;
  let reset;

  btn.addEventListener("click", async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      ok = false;
    }
    if (label) label.textContent = ok ? "Copied!" : address;
    btn.classList.toggle("is-copied", ok);
    clearTimeout(reset);
    reset = setTimeout(() => {
      if (label) label.textContent = btn.dataset.idleLabel || "Copy email";
      btn.classList.remove("is-copied");
    }, 2400);
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
  const cards = document.querySelectorAll(".wcard");
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

// ---------------------------------------------------------------------------
// Language — the page is authored in Greek; English is swapped in from the
// dictionary below. Order of precedence: ?lang= in the URL, then the last
// choice saved in this browser, then the browser's own language. Every element
// that carries a data-i18n attribute gets its text replaced; nothing else is
// touched.
//
// NOTE: this is a client-side swap, so ?lang=en serves the same Greek HTML to
// a crawler that does not run JS. If English SEO ever matters, this needs a
// build step emitting a real static /en/ page.
// ---------------------------------------------------------------------------
(() => {
  const EN = {
    skip: "Skip to content",
    navServices: "Services", navWork: "Work", navProcess: "Process", navCta: "Get in touch",
    available: "Taking on new projects",
    heroTitle1: "Software that runs every day", heroTitle2: "inside real businesses.",
    heroBody: "I design and build web apps, ERPs, e-shops and industrial dashboards end-to-end. Seven of the projects below run in production with real users; one is in development and one is a personal tool.",
    heroCta1: "Discuss your project", heroCta2: "See the work",
    stat1: "years running production systems", stat2: "projects with real users", stat3: "response time to every message",
    heroBadgeLabel: "In production since 2024", heroBadgeValue: "ERP · 70,000 lines of code",
    liveLabel: "Live right now", liveSub: "Open them — no need to take my word for it.",
    live1: "Event photo-collection SaaS", live2: "Sponsorship platform for cultural associations", live3: "Holiday apartments website",
    servicesTitle: "What I can take on",
    servicesSub: "One partner for the whole technical side — from the database to the screen your customer sees.",
    svc1t: "Custom web apps & SaaS", svc1d: "Platforms with users, subscriptions, payments (Stripe / Viva Wallet) and file storage — built to scale.",
    svc2t: "ERP & internal tools", svc2d: "Customer, contract, warehouse, invoicing and field-technician management — shaped around how you already work.",
    svc3t: "E-shops (WooCommerce)", svc3d: "Online stores with Greek-market integrations: myDATA, ACS, Box Now, Viva Wallet, plus custom plugins where needed.",
    svc4t: "Dashboards & industrial IoT", svc4d: "Real-time sensor monitoring, alarms, charts and bridges to existing (even legacy) systems.",
    svc5t: "3D & WebGL", svc5d: "Three-dimensional visualisation in the browser — from tank heatmaps to 3D-print costing tools.",
    svc6t: "Digital menus & small sites", svc6d: "Fast bilingual websites for hospitality and tourism, with zero monthly running cost.",
    caseTitle: "Case study in depth", present: "present", production: "Production",
    caseLead: "The ERP that runs the whole of IQsoft — customers, contracts, tickets, warehouse, timesheets, invoicing. Sole developer from database schema to deployment.",
    caseM1: "lines of code", caseM2: "modules (Django apps)", caseM3: "database for everything",
    caseProblemL: "The problem", caseProblem: "The company ran on scattered files, hand-written tickets and no single view of contracts or stock. Field technicians had access to nothing.",
    caseSolutionL: "The solution", caseSolution: "One Next.js + Django system with roles, per-department workflows and mobile-friendly screens for technicians. Gradual migration, no downtime.",
    caseResultL: "The result", caseResult: "The entire company has run on one platform since 2024. Every ticket, contract and invoice goes through it — and product decisions come from daily contact with the users.",
    readCase: "Full case study",
    workTitle: "Selected work", industrial: "Industrial", publicSector: "Public sector", smallSite: "Restaurants",
    platform: "Platform", hospitality: "Tourism", sideProject: "Side project",
    pLoukoumi: "A platform matching cultural associations with sponsor companies — bilingual, every listing verified.",
    pDk: "Bilingual site for three holiday apartments in Ioannina — one file, zero dependencies, Booking.com hand-off.",
    pTank: "Real-time LNG tank monitoring — 189 sensors, 3D thermal heatmap, alarms.",
    pLumap: "GIS platform for municipal lighting — every pole and pillar of a municipality on one map, with issues and stats.",
    pCheese: "Guests upload photos via one QR code, no app — live wall, Stripe payments, ZIP export.",
    pPrinto: "3D-printing store with STL upload and instant quoting, myDATA, couriers and Viva Wallet.",
    pPriceLab: "In-browser 3D-print cost calculator — material, power, labour, wear, VAT.",
    pTaverna: "Bilingual digital menu for a tavern, light/dark, zero running cost.",
    processTitle: "How we work together", processSub: "Clear stages, clear communication. You always know where your project stands.",
    step1t: "Discovery", step1d: "A free 30-minute call to understand what you actually need. Followed by a written proposal with scope, timeline and cost.",
    step2t: "Design", step2d: "Screen prototypes and data structure before any code — so you approve what will be built.",
    step3t: "Build in stages", step3d: "Deliveries every 1–2 weeks on your own test environment. You see progress, not promises.",
    step4t: "Launch & support", step4d: "Deployment, training, documentation. The code is yours. Optional maintenance afterwards.",
    aboutLabel: "Who I am",
    aboutBody: "Aristotelis Gkouvas — full-stack developer at IQsoft and Computer Science student at the University of Ioannina. Beyond code, I do on-site installations and support — which is why I build software non-technical people understand.",
    aboutLoc: "Ioannina · remote across Greece", aboutEdu: "BSc Computer Science, Univ. of Ioannina", aboutCv: "CV →",
    githubLabel: "GitHub activity (last year)",
    faqTitle: "Frequently asked questions",
    faq1q: "How long does a project take?", faq1a: "A site or digital menu: 1–2 weeks. An e-shop with Greek integrations: 3–6 weeks. A custom app or ERP: 2–4 months to a first working version, with deliveries every 1–2 weeks. You get a written timeline before we start.",
    faq2q: "What happens after delivery?", faq2a: "Fixes are covered for the first 30 days. After that, choose monthly maintenance (updates, backups, small changes) or call me only when needed. The production projects above are maintained exactly this way.",
    faq3q: "Who owns the code?", faq3a: "You do. On final payment, code and data are handed over to your own accounts (GitHub, server, domain). No lock-in — any developer can continue it.",
    faq4q: "Hosting and domain — what do I need?", faq4a: "I guide you through buying a domain and hosting in your name and handle the entire technical setup (server, SSL, backups). For small sites the running cost is often zero.",
    contactLabel: "Contact", contactTitle: "Have an idea, or a problem that needs solving?",
    contactBody: "Send me two lines about what you need. I reply within 24 hours with next steps — no commitment.",
    contactEmail: "Send an email", contactCopy: "Copy email", contactCv: "CV",
    footer: "Designed & built by Aristotelis Gkouvas",
    metaDescription: "Aristotelis Gkouvas — full-stack developer. Web apps, ERPs, e-shops and industrial dashboards running in production inside real businesses.",
  };

  const nodes = document.querySelectorAll("[data-i18n]");
  if (!nodes.length) return;

  // Greek is what is in the markup, so capture it once before any swap.
  const EL = {};
  nodes.forEach((n) => { EL[n.dataset.i18n] = n.textContent.trim(); });
  const elMeta = document.querySelector('meta[name="description"]');
  EL.metaDescription = elMeta ? elMeta.content : "";

  const KEY = "ag-portfolio-lang";
  const toggle = document.querySelectorAll(".lang-toggle button[data-lang]");

  const apply = (lang) => {
    const dict = lang === "en" ? EN : EL;
    nodes.forEach((n) => {
      const v = dict[n.dataset.i18n];
      if (v != null) n.textContent = v;
    });
    if (elMeta && dict.metaDescription) elMeta.content = dict.metaDescription;
    document.documentElement.lang = lang;
    toggle.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    // The copy-email button restores its own label after a click; keep it in
    // the current language.
    const copy = document.querySelector(".copy-email");
    if (copy) copy.dataset.idleLabel = dict.contactCopy || "";
  };

  const fromUrl = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  // With no explicit choice, follow the browser: a recruiter arriving from a
  // LinkedIn link would otherwise land on a page they cannot read, with the
  // toggle a 12px pill in the header.
  const guess = (navigator.languages || [navigator.language || "el"])
    .some((l) => String(l).toLowerCase().startsWith("el")) ? "el" : "en";
  const initial = ["el", "en"].includes(fromUrl)
    ? fromUrl
    : (saved === "en" || saved === "el" ? saved : guess);
  apply(initial);

  toggle.forEach((b) => b.addEventListener("click", () => {
    const lang = b.dataset.lang;
    try { localStorage.setItem(KEY, lang); } catch {}
    const url = new URL(location.href);
    if (lang === "en") url.searchParams.set("lang", "en"); else url.searchParams.delete("lang");
    history.replaceState(null, "", url);
    apply(lang);
  }));
})();
