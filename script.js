/* =============================================
   WK STUDIO — script.js
   Interações: WhatsApp, Navbar, Scroll, Animações
   ============================================= */

(function () {
  "use strict";

  /* ---- CONFIGURAÇÃO ---- */
  const WHATSAPP_NUMBER = "5577999684834";
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Olá! Vim pelo site da WK Studio e gostaria de saber mais sobre os serviços de criação de site e presença digital. Poderia me ajudar?"
  );
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  /* ---- WHATSAPP — atribuir a todos os botões ---- */
  const whatsappIds = [
    "navWhatsapp",
    "mobileWhatsapp",
    "heroWhatsapp",
    "solucaoWhatsapp",
    "planosWhatsapp",
    "manutencaoWhatsapp",
    "ctaWhatsapp",
    "whatsappFloat",
    "footerWhatsapp",
  ];

  function assignWhatsapp() {
    whatsappIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("href", WHATSAPP_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // Plano CTAs (selecionados por classe)
    const planoCTAs = document.querySelectorAll(".plano-cta");
    planoCTAs.forEach(function (btn) {
      const planName = btn.closest(".plano-card")?.querySelector(".plano-nome")?.textContent || "";
      const planMsg = encodeURIComponent(
        `Olá! Vim pelo site da WK Studio e tenho interesse no plano ${planName}. Pode me dar mais detalhes?`
      );
      btn.setAttribute("href", `https://wa.me/${WHATSAPP_NUMBER}?text=${planMsg}`);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---- NAVBAR — scroll effect ---- */
  const navbar = document.getElementById("navbar");

  function handleNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  /* ---- MOBILE MENU ---- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    hamburger.setAttribute("aria-expanded", menuOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", menuOpen ? "Fechar menu" : "Abrir menu");

    // Animar hamburguer → X
    const spans = hamburger.querySelectorAll("span");
    if (menuOpen) {
      spans[0].style.transform = "rotate(45deg) translateY(7px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translateY(-7px)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    }
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menu");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "";
    spans[2].style.transform = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  // Fechar menu ao clicar em link
  const mobileLinks = document.querySelectorAll(".mobile-link");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---- SMOOTH SCROLL para âncoras ---- */
  function handleAnchorClicks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href === "") return; // WhatsApp buttons handled separately
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  /* ---- REVEAL ON SCROLL (Intersection Observer) ---- */
  function setupReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger delay baseado na posição no grid
            const siblings = Array.from(entry.target.parentElement.children);
            const index = siblings.indexOf(entry.target);
            const delay = (index % 4) * 100;
            entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- ACTIVE NAV LINK no scroll ---- */
  function setupActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navAs = document.querySelectorAll(".nav-links a");
    if (!sections.length || !navAs.length) return;

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navAs.forEach(function (a) {
              a.style.color = "";
              if (a.getAttribute("href") === "#" + id) {
                a.style.color = "var(--gold)";
              }
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  }

  /* ---- COUNTER ANIMATION nos stats ---- */
  function animateCounters() {
    const statNums = document.querySelectorAll(".stat-num");
    statNums.forEach(function (el) {
      const text = el.textContent.trim();
      const numMatch = text.match(/[\d.]+/);
      if (!numMatch) return;

      const target = parseFloat(numMatch[0]);
      const prefix = text.match(/^[^0-9]*/)[0] || "";
      const suffix = text.match(/[^0-9.]+$/)?.[0] || "";
      const isInt = Number.isInteger(target);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;
        el.textContent = prefix + (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      // Ativar só quando visível
      const obs = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            requestAnimationFrame(tick);
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
    });
  }

  /* ---- INIT ---- */
  function init() {
    assignWhatsapp();
    handleNavbar();
    handleAnchorClicks();
    setupReveal();
    setupActiveNav();
    animateCounters();

    window.addEventListener("scroll", handleNavbar, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
