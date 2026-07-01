import { load as parseYaml } from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js";

const GA_MEASUREMENT_ID = "G-69Q6FVVCTX";

const initGoogleAnalytics = () => {
  const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  if (!document.querySelector(`script[src="${gaSrc}"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = gaSrc;
    document.head.appendChild(gaScript);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
};

initGoogleAnalytics();

const trackGaEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
};

const initConversionTracking = () => {
  document.addEventListener("click", (event) => {
    const trackedElement = event.target.closest("[data-track]");
    if (!trackedElement) {
      return;
    }

    trackGaEvent("cta_click", {
      event_category: "engagement",
      event_label: trackedElement.dataset.track,
      page_path: window.location.pathname,
    });
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    if (form.name === "contact" || form.classList.contains("contact-form")) {
      trackGaEvent("form_submit", {
        event_category: "conversion",
        event_label: "contact_form",
        page_path: window.location.pathname,
      });
    }
  });

  const path = window.location.pathname;
  if (path === "/thank-you" || path === "/thank-you.html") {
    trackGaEvent("generate_lead", {
      event_category: "conversion",
      event_label: "thank_you_page",
      page_path: path,
    });
  }
};

initConversionTracking();

const specialtyMenuItems = [
  { label: "Trauma", href: "/specialties-trauma" },
  { label: "EMDR", href: "/specialties-emdr" },
  { label: "Stress & Anxiety", href: "/specialties-stress-anxiety" },
  { label: "Depression", href: "/specialties-depression" },
  { label: "Grief & Loss", href: "/specialties-grief-loss" },
  { label: "Couples", href: "/specialties-couples" },
  { label: "Somatic Therapy", href: "/specialties-somatic-therapy" },
  { label: "Divorce", href: "/specialties-divorce" },
];

const aboutMenuItems = [
  { label: "About Us", href: "/about" },
  { label: "Reviews", href: "/reviews" },
];

const normalizePath = (path) => {
  const sanitized = String(path ?? "").replace(/\/+$/, "");
  if (!sanitized || sanitized === "/index" || sanitized === "/index.html") {
    return "/";
  }
  return sanitized.replace(/\.html$/, "");
};

const initSpecialtiesSubmenu = () => {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) {
    return;
  }

  const specialtiesLink = navLinks.querySelector("a[href='/specialties'], a[href='/specialties/']");
  if (!specialtiesLink) {
    return;
  }

  const currentPath = normalizePath(window.location.pathname);
  const isSpecialtyPage = specialtyMenuItems.some((item) => normalizePath(item.href) === currentPath);
  const isSpecialtiesOverview = currentPath === "/specialties";

  const dropdown = document.createElement("div");
  dropdown.className = "nav-dropdown";
  if (specialtiesLink.classList.contains("active") || isSpecialtyPage || isSpecialtiesOverview) {
    dropdown.classList.add("is-active");
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-dropdown-toggle";
  toggle.textContent = "Specialties";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Toggle specialties menu");

  const menu = document.createElement("div");
  menu.className = "nav-submenu";
  menu.id = "specialties-submenu";
  toggle.setAttribute("aria-controls", menu.id);

  specialtyMenuItems.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    if (normalizePath(item.href) === currentPath) {
      link.classList.add("active");
      toggle.setAttribute("aria-current", "page");
    }
    menu.append(link);
  });

  let closeTimer = null;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const clearCloseTimer = () => {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const setOpen = (open) => {
    clearCloseTimer();
    dropdown.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      if (!dropdown.matches(":focus-within")) {
        setOpen(false);
      }
    }, 180);
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!dropdown.classList.contains("open"));
  });

  if (supportsHover) {
    dropdown.addEventListener("mouseenter", () => {
      setOpen(true);
    });

    dropdown.addEventListener("mouseleave", () => {
      scheduleClose();
    });
  }

  dropdown.addEventListener("focusin", () => {
    setOpen(true);
  });

  dropdown.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (!dropdown.contains(document.activeElement)) {
        scheduleClose();
      }
    });
  });

  dropdown.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      setOpen(false);
    }
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  dropdown.append(toggle, menu);
  specialtiesLink.replaceWith(dropdown);
};

const initAboutSubmenu = () => {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) {
    return;
  }

  const aboutLink = navLinks.querySelector("a[href='/about'], a[href='/about/']");
  if (!aboutLink) {
    return;
  }

  const currentPath = normalizePath(window.location.pathname);
  const isAboutMenuPage = aboutMenuItems.some((item) => normalizePath(item.href) === currentPath);

  const dropdown = document.createElement("div");
  dropdown.className = "nav-dropdown";
  if (aboutLink.classList.contains("active") || isAboutMenuPage) {
    dropdown.classList.add("is-active");
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-dropdown-toggle";
  toggle.textContent = "About Us";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Toggle about menu");

  const menu = document.createElement("div");
  menu.className = "nav-submenu";
  menu.id = "about-submenu";
  toggle.setAttribute("aria-controls", menu.id);

  aboutMenuItems.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    if (normalizePath(item.href) === currentPath) {
      link.classList.add("active");
      toggle.setAttribute("aria-current", "page");
    }
    menu.append(link);
  });

  let closeTimer = null;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const clearCloseTimer = () => {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const setOpen = (open) => {
    clearCloseTimer();
    dropdown.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      if (!dropdown.matches(":focus-within")) {
        setOpen(false);
      }
    }, 180);
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!dropdown.classList.contains("open"));
  });

  if (supportsHover) {
    dropdown.addEventListener("mouseenter", () => {
      setOpen(true);
    });

    dropdown.addEventListener("mouseleave", () => {
      scheduleClose();
    });
  }

  dropdown.addEventListener("focusin", () => {
    setOpen(true);
  });

  dropdown.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (!dropdown.contains(document.activeElement)) {
        scheduleClose();
      }
    });
  });

  dropdown.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      setOpen(false);
    }
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  dropdown.append(toggle, menu);
  aboutLink.replaceWith(dropdown);
};

const initMainMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("show"));
  }
};

initSpecialtiesSubmenu();
initAboutSubmenu();
initMainMenu();

marked.setOptions({ breaks: true });

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const md = (value) => marked.parse(String(value ?? ""));

const renderTestimonialSection = (testimonial, options = {}) => {
  if (!testimonial || !testimonial.quote) {
    return "";
  }

  const sectionClass = options.compact ? "section compact" : "section";
  const eyebrow = options.eyebrow ?? testimonial.eyebrow;
  const title = options.title ?? testimonial.title;
  const sourceLabel = testimonial.sourceLabel ?? testimonial.source ?? "Google Review";
  const rating = testimonial.rating ?? "";
  const author = testimonial.author ?? "";

  return `
    <section class='${sectionClass}'>
      <div class='container'>
        ${eyebrow ? `<div class='eyebrow'>${escapeHtml(eyebrow)}</div>` : ""}
        ${title ? `<h2>${escapeHtml(title)}</h2>` : ""}
        <article class='card testimonial-card'>
          <p class='testimonial-quote'>&ldquo;${escapeHtml(testimonial.quote)}&rdquo;</p>
          <p class='testimonial-meta'>
            ${author ? `<span>${escapeHtml(author)}</span>` : ""}
            ${sourceLabel ? `<span>${escapeHtml(sourceLabel)}</span>` : ""}
            ${rating ? `<span class='testimonial-rating'>${escapeHtml(rating)}</span>` : ""}
          </p>
        </article>
      </div>
    </section>
  `;
};

const parseFrontmatter = (raw) => {
  if (!raw.startsWith("---")) {
    return {};
  }
  const endIndex = raw.indexOf("\n---", 3);
  if (endIndex === -1) {
    return {};
  }
  const yaml = raw.slice(4, endIndex);
  return parseYaml(yaml) ?? {};
};

const renderHome = (data) => {
  const hero = data.hero ?? {};
  const marquee = Array.isArray(data.marquee) ? data.marquee : [];
  const welcome = data.welcome ?? {};
  const approachIntro = data.approachIntro ?? {};
  const howItWorks = data.howItWorks ?? {};
  const phases = Array.isArray(howItWorks.phases) ? howItWorks.phases : [];
  const services = data.services ?? {};
  const serviceCards = Array.isArray(services.cards) ? services.cards : [];
  const reasons = data.reasons ?? {};
  const reasonItems = Array.isArray(reasons.items) ? reasons.items : [];
  const midpoint = Math.ceil(reasonItems.length / 2);
  const reasonLeft = reasonItems.slice(0, midpoint);
  const reasonRight = reasonItems.slice(midpoint);
  const testimonial = data.testimonial ?? {};
  const cta = data.cta ?? {};

  const renderReason = (item) => `
    <div class='icon-row'>
      <div class='icon'>${escapeHtml(item.number)}</div>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </div>`;

  return `
    <section class='hero'>
      <video class='hero-video' autoplay muted loop playsinline webkit-playsinline preload='auto' poster='assets/Hero.svg' aria-hidden='true'>
        <source src='assets/LandingPage.mp4' type='video/mp4'>
      </video>
      <div class='container'>
        <div class='hero-card'>
          <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
          <h1>${escapeHtml(hero.title)}</h1>
          ${md(hero.intro)}
          <div class='hero-actions'>
            <a class='btn' href='${escapeHtml(hero.primaryCtaHref)}'>${escapeHtml(hero.primaryCtaText)}</a>
            <a class='btn secondary' href='${escapeHtml(hero.secondaryCtaHref)}'>${escapeHtml(hero.secondaryCtaText)}</a>
          </div>
        </div>
      </div>
    </section>

    <section class='marquee'>
      <div class='container'>
        ${marquee.map((item, index) => `<span>${escapeHtml(item)}</span>${index < marquee.length - 1 ? "<span>•</span>" : ""}`).join("")}
      </div>
    </section>

    <section class='section'>
      <div class='container grid-2'>
        <div>
          <div class='eyebrow'>${escapeHtml(welcome.eyebrow)}</div>
          <h2>${escapeHtml(welcome.title)}</h2>
          ${md(welcome.body)}
          <a class='btn secondary' href='${escapeHtml(welcome.buttonHref)}'>${escapeHtml(welcome.buttonText)}</a>
        </div>
        <div class='image-card'><img src='${escapeHtml(welcome.imageSrc)}' alt='${escapeHtml(welcome.imageAlt)}'></div>
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-2'>
        <div class='image-card'><img src='${escapeHtml(approachIntro.imageSrc)}' alt='${escapeHtml(approachIntro.imageAlt)}'></div>
        <div>
          <div class='eyebrow'>${escapeHtml(approachIntro.eyebrow)}</div>
          <h2>${escapeHtml(approachIntro.title)}</h2>
          ${md(approachIntro.body)}
          <a class='btn' href='${escapeHtml(approachIntro.buttonHref)}'>${escapeHtml(approachIntro.buttonText)}</a>
        </div>
      </div>
    </section>

    <section class='section'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(howItWorks.eyebrow)}</div>
        <h2>${escapeHtml(howItWorks.title)}</h2>
        <div class='grid-4'>
          ${phases
            .map(
              (phase) => `
            <article class='card phase' data-step='${escapeHtml(phase.step)}'>
              <h3>${escapeHtml(phase.title)}</h3>
              <p>${escapeHtml(phase.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(services.eyebrow)}</div>
        <h2>${escapeHtml(services.title)}</h2>
        <div class='grid-4'>
          ${serviceCards
            .map(
              (card) => `
            <article class='card service-card'>
              <h3>${escapeHtml(card.title)}</h3>
              <p>${escapeHtml(card.description)}</p>
            </article>`
            )
            .join("")}
        </div>
        <p class='small' style='margin-top:18px;'>${escapeHtml(services.note)}</p>
      </div>
    </section>

    <section class='section'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(reasons.eyebrow)}</div>
        <h2>${escapeHtml(reasons.title)}</h2>
        <div class='grid-2'>
          <div class='card'>${reasonLeft.map(renderReason).join("")}</div>
          <div class='card'>${reasonRight.map(renderReason).join("")}</div>
        </div>
      </div>
    </section>

    ${renderTestimonialSection(testimonial, { compact: true })}

    <section class='section'>
      <div class='container'>
        <div class='cta'>
          <div class='eyebrow'>${escapeHtml(cta.eyebrow)}</div>
          <h2>${escapeHtml(cta.title)}</h2>
          <p>${escapeHtml(cta.body)}</p>
          <div class='hero-actions'>
            <a class='btn' href='${escapeHtml(cta.primaryCtaHref)}'>${escapeHtml(cta.primaryCtaText)}</a>
            <a class='btn secondary' href='${escapeHtml(cta.secondaryCtaHref)}'>${escapeHtml(cta.secondaryCtaText)}</a>
          </div>
        </div>
      </div>
    </section>
  `;
};

const renderFaq = (data) => {
  const hero = data.hero ?? {};
  const faq = data.faq ?? {};
  const faqItems = Array.isArray(faq.items) ? faq.items : [];

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        <p>${escapeHtml(hero.intro)}</p>
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(faq.eyebrow)}</div>
        <h2>${escapeHtml(faq.title)}</h2>
        <div class='faq'>
          ${faqItems
            .map(
              (item) => `
            <article class='card faq-item'>
              <h3>${escapeHtml(item.question)}</h3>
              <p>${escapeHtml(item.answer)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
};

const renderApproach = (data) => {
  const hero = data.hero ?? {};
  const sectionOne = data.sectionOne ?? {};
  const pillars = Array.isArray(data.pillars) ? data.pillars : [];
  const process = data.process ?? {};
  const steps = Array.isArray(process.steps) ? process.steps : [];
  const cta = data.cta ?? {};

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        ${hero.intro ? md(hero.intro) : ""}
        ${
          hero.primaryCtaText && hero.primaryCtaHref
            ? `<div class='hero-actions'><a class='btn' href='${escapeHtml(hero.primaryCtaHref)}'>${escapeHtml(hero.primaryCtaText)}</a></div>`
            : ""
        }
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-2'>
        <div>
          <h2>${escapeHtml(sectionOne.title)}</h2>
          ${md(sectionOne.body)}
        </div>
        <div class='image-card'><img src='${escapeHtml(sectionOne.imageSrc)}' alt='${escapeHtml(sectionOne.imageAlt)}'></div>
      </div>
    </section>

    ${
      pillars.length
        ? `<section class='section compact'>
      <div class='container grid-3 approach-pillars'>
        ${pillars
          .map(
            (pillar) => `
          <article class='card'>
            ${pillar.imageSrc ? `<img src='${escapeHtml(pillar.imageSrc)}' alt='${escapeHtml(pillar.imageAlt || pillar.title)}'>` : ""}
            <h3>${escapeHtml(pillar.title)}</h3>
            <p>${escapeHtml(pillar.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>`
        : ""
    }

    <section class='section'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(process.eyebrow)}</div>
        ${process.title ? `<h2>${escapeHtml(process.title)}</h2>` : ""}
        <div class='approach-steps'>
          ${steps
            .map(
              (step) => `
            <article class='card phase' data-step='${escapeHtml(step.step)}'>
              <h3>${escapeHtml(step.title)}</h3>
              <p>${escapeHtml(step.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    ${
      data.note
        ? `<section class='section compact'>
      <div class='container'>
        <div class='notice'>${escapeHtml(data.note)}</div>
      </div>
    </section>`
        : ""
    }

    ${
      cta.title
        ? `<section class='section'>
      <div class='container'>
        <div class='cta'>
          <h2>${escapeHtml(cta.title)}</h2>
          ${cta.body ? `<p>${escapeHtml(cta.body)}</p>` : ""}
          ${
            cta.primaryCtaText && cta.primaryCtaHref
              ? `<div class='hero-actions'><a class='btn' href='${escapeHtml(cta.primaryCtaHref)}'>${escapeHtml(cta.primaryCtaText)}</a></div>`
              : ""
          }
        </div>
      </div>
    </section>`
        : ""
    }
  `;
};

const renderServices = (data) => {
  const hero = data.hero ?? {};
  const primary = Array.isArray(data.primaryServices) ? data.primaryServices : [];
  const optional = data.optional ?? {};
  const optionalCards = Array.isArray(optional.cards) ? optional.cards : [];

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        <p>${escapeHtml(hero.intro)}</p>
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        <div class='services-list'>
        ${primary
          .map(
            (item) => `
          <article class='card service-item'>
            <h2>${escapeHtml(item.title)}</h2>
            <div class='service-copy'>${md(item.description)}</div>
          </article>`
          )
          .join("")}
        </div>
      </div>
    </section>

    ${
      optionalCards.length
        ? `<section class='section compact'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(optional.eyebrow)}</div>
        <div class='grid-3'>
          ${optionalCards
            .map(
              (item) => `
            <article class='card'>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }
  `;
};

const renderSpecialties = (data) => {
  const hero = data.hero ?? {};
  const specialties = Array.isArray(data.specialties) ? data.specialties : [];
  const cta = data.cta ?? {};

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        <p>${escapeHtml(hero.intro)}</p>
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        <div class='specialties-list'>
        ${specialties
          .map(
            (item) => `
          <article class='card specialty-item'>
            <h2>${escapeHtml(item.title)}</h2>
            <div class='specialty-copy'>${md(item.description)}</div>
            ${
              item.href
                ? `<a class='btn secondary specialty-link' href='${escapeHtml(item.href)}'>${escapeHtml(item.linkText || "Learn more")}</a>`
                : ""
            }
          </article>`
          )
          .join("")}
        </div>
      </div>
    </section>

    <section class='section'>
      <div class='container'>
        <div class='cta'>
          <h2>${escapeHtml(cta.title)}</h2>
          <p>${escapeHtml(cta.body)}</p>
          <div class='hero-actions'>
            <a class='btn' href='${escapeHtml(cta.primaryCtaHref)}'>${escapeHtml(cta.primaryCtaText)}</a>
          </div>
        </div>
      </div>
    </section>
  `;
};

const renderSpecialtyPage = (data) => {
  const hero = data.hero ?? {};
  const approach = data.approach ?? {};
  const cta = data.cta ?? {};

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        <p>${escapeHtml(hero.intro)}</p>
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        <article class='card specialty-approach'>
          ${approach.title ? `<h2>${escapeHtml(approach.title)}</h2>` : ""}
          ${approach.body ? md(approach.body) : "<p>We will add detailed information about this specialty soon.</p>"}
        </article>
      </div>
    </section>

    ${
      cta.title
        ? `<section class='section'>
      <div class='container'>
        <div class='cta'>
          <h2>${escapeHtml(cta.title)}</h2>
          ${cta.body ? `<p>${escapeHtml(cta.body)}</p>` : ""}
          ${
            cta.primaryCtaText && cta.primaryCtaHref
              ? `<div class='hero-actions'><a class='btn' href='${escapeHtml(cta.primaryCtaHref)}'>${escapeHtml(cta.primaryCtaText)}</a></div>`
              : ""
          }
        </div>
      </div>
    </section>`
        : ""
    }
  `;
};

const renderLocalLanding = (data) => {
  const hero = data.hero ?? {};
  const sections = data.sections ?? {};
  const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];
  const approachItems = Array.isArray(data.approach) ? data.approach : [];
  const expectItems = Array.isArray(data.whatToExpect) ? data.whatToExpect : [];
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  const therapist = data.therapist ?? {};
  const cta = data.cta ?? {};
  const internalLinks = Array.isArray(data.internalLinks) ? data.internalLinks : [];

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        ${hero.intro ? md(hero.intro) : ""}
        <div class='hero-actions'>
          <a class='btn' data-track='local-primary-cta' href='${escapeHtml(hero.primaryCtaHref || "/contact")}'>${escapeHtml(hero.primaryCtaText || "Start your journey now")}</a>
          <a class='btn secondary' href='tel:+17604547249'>Call (760) 454-7249</a>
        </div>
      </div>
    </section>

    ${
      sections.intro
        ? `<section class='section compact'>
      <div class='container'>
        <article class='card'>
          ${sections.introTitle ? `<h2>${escapeHtml(sections.introTitle)}</h2>` : ""}
          ${md(sections.intro)}
        </article>
      </div>
    </section>`
        : ""
    }

    ${
      symptoms.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.symptomsTitle || "Common reasons people seek therapy")}</h2>
        <div class='grid-3'>
          ${symptoms
            .map(
              (item) => `
            <article class='card'>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    ${
      approachItems.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.approachTitle || "Our approach")}</h2>
        <div class='grid-3'>
          ${approachItems
            .map(
              (item) => `
            <article class='card'>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    ${
      expectItems.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.expectTitle || "What to expect in your first session")}</h2>
        <div class='approach-steps'>
          ${expectItems
            .map(
              (item) => `
            <article class='card phase' data-step='${escapeHtml(item.step || "")}'>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    ${
      therapist.title
        ? `<section class='section compact'>
      <div class='container'>
        <article class='card'>
          <h2>${escapeHtml(therapist.title)}</h2>
          ${therapist.body ? md(therapist.body) : ""}
          ${therapist.license ? `<p><strong>License:</strong> ${escapeHtml(therapist.license)}</p>` : ""}
        </article>
      </div>
    </section>`
        : ""
    }

    ${
      faqs.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.faqTitle || "Frequently asked questions")}</h2>
        <div class='faq'>
          ${faqs
            .map(
              (item) => `
            <article class='card faq-item'>
              <h3>${escapeHtml(item.question)}</h3>
              <div>${md(item.answer)}</div>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    ${
      internalLinks.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.exploreTitle || "Explore related specialties")}</h2>
        <div class='grid-3'>
          ${internalLinks
            .map(
              (item) => `
            <article class='card'>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
              <a class='btn secondary' href='${escapeHtml(item.href)}'>Learn more</a>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    <section class='section'>
      <div class='container'>
        <div class='cta'>
          <div class='eyebrow'>${escapeHtml(cta.eyebrow)}</div>
          <h2>${escapeHtml(cta.title)}</h2>
          ${cta.body ? `<p>${escapeHtml(cta.body)}</p>` : ""}
          <div class='hero-actions'>
            <a class='btn' data-track='local-final-cta' href='${escapeHtml(cta.primaryCtaHref || "/contact")}'>${escapeHtml(cta.primaryCtaText || "Start your journey now")}</a>
            <a class='btn secondary' href='tel:+17604547249'>Call (760) 454-7249</a>
          </div>
        </div>
      </div>
    </section>
  `;
};

const renderAdLandingPage = (data) => {
  const hero = data.hero ?? {};
  const sections = data.sections ?? {};
  const highlights = Array.isArray(data.highlights) ? data.highlights : [];
  const steps = Array.isArray(data.steps) ? data.steps : [];
  const testimonial = data.testimonial ?? {};
  const cta = data.cta ?? {};

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        ${hero.intro ? md(hero.intro) : ""}
        <div class='hero-actions'>
          <a class='btn' data-track='lp-primary-cta' href='${escapeHtml(hero.primaryCtaHref || "/contact")}'>${escapeHtml(hero.primaryCtaText || "Start your journey now")}</a>
          <a class='btn secondary' href='tel:+17604547249'>Call (760) 454-7249</a>
        </div>
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-2'>
        <article class='card'>
          <h2>${escapeHtml(sections.problemTitle)}</h2>
          ${sections.problemBody ? md(sections.problemBody) : ""}
        </article>
        <article class='card'>
          <h2>${escapeHtml(sections.approachTitle)}</h2>
          ${sections.approachBody ? md(sections.approachBody) : ""}
        </article>
      </div>
    </section>

    ${
      highlights.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.highlightsTitle || "How we support your healing")}</h2>
        <div class='grid-3'>
          ${highlights
            .map(
              (item) => `
            <article class='card'>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    ${
      steps.length
        ? `<section class='section compact'>
      <div class='container'>
        <h2>${escapeHtml(sections.processTitle || "What to expect")}</h2>
        <div class='approach-steps'>
          ${steps
            .map(
              (step) => `
            <article class='card phase' data-step='${escapeHtml(step.step)}'>
              <h3>${escapeHtml(step.title)}</h3>
              <p>${escapeHtml(step.description)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    ${renderTestimonialSection(testimonial, { compact: true, eyebrow: "Client Review" })}

    <section class='section'>
      <div class='container'>
        <div class='cta'>
          <div class='eyebrow'>${escapeHtml(cta.eyebrow)}</div>
          <h2>${escapeHtml(cta.title)}</h2>
          ${cta.body ? `<p>${escapeHtml(cta.body)}</p>` : ""}
          <div class='hero-actions'>
            <a class='btn' data-track='lp-final-cta' href='${escapeHtml(cta.primaryCtaHref || "/contact")}'>${escapeHtml(cta.primaryCtaText || "Start your journey now")}</a>
          </div>
        </div>
      </div>
    </section>
  `;
};

const renderAbout = (data) => {
  const hero = data.hero ?? {};
  const bio = data.bio ?? {};
  const bullets = Array.isArray(bio.bullets) ? bio.bullets : [];
  const values = Array.isArray(data.values) ? data.values : [];
  const testimonial = data.testimonial ?? {};

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-2'>
        <div class='image-card about-portrait'><img src='${escapeHtml(bio.imageSrc)}' alt='${escapeHtml(bio.imageAlt)}'></div>
        <div>
          <h2>${escapeHtml(bio.title)}</h2>
          ${md(bio.body)}
          <p>Suggested structure:</p>
          <ul class='list-clean'>
            ${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-3'>
        ${values
          .map(
            (item) => `
          <article class='card'>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>

    ${renderTestimonialSection(testimonial, { compact: true })}
  `;
};

const renderReviews = (data) => {
  const hero = data.hero ?? {};
  const intro = data.intro ?? {};
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  const cta = data.cta ?? {};

  const renderReviewCard = (review) => `
    <article class='card testimonial-card'>
      ${review.title ? `<h3>${escapeHtml(review.title)}</h3>` : ""}
      <p class='testimonial-quote'>&ldquo;${escapeHtml(review.quote)}&rdquo;</p>
      <p class='testimonial-meta'>
        ${review.author ? `<span>${escapeHtml(review.author)}</span>` : ""}
        ${review.sourceLabel ? `<span>${escapeHtml(review.sourceLabel)}</span>` : ""}
        ${review.rating ? `<span class='testimonial-rating'>${escapeHtml(review.rating)}</span>` : ""}
      </p>
    </article>
  `;

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        ${hero.intro ? md(hero.intro) : ""}
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        ${intro.eyebrow ? `<div class='eyebrow'>${escapeHtml(intro.eyebrow)}</div>` : ""}
        ${intro.title ? `<h2>${escapeHtml(intro.title)}</h2>` : ""}
        ${intro.body ? md(intro.body) : ""}
      </div>
    </section>

    <section class='section compact'>
      <div class='container'>
        <div class='review-list'>
          ${reviews.map(renderReviewCard).join("")}
        </div>
      </div>
    </section>

    ${
      cta.title
        ? `<section class='section'>
      <div class='container'>
        <div class='cta'>
          <h2>${escapeHtml(cta.title)}</h2>
          ${cta.body ? `<p>${escapeHtml(cta.body)}</p>` : ""}
          ${
            cta.primaryCtaText && cta.primaryCtaHref
              ? `<div class='hero-actions'><a class='btn' href='${escapeHtml(cta.primaryCtaHref)}'>${escapeHtml(cta.primaryCtaText)}</a></div>`
              : ""
          }
        </div>
      </div>
    </section>`
        : ""
    }
  `;
};

const renderContact = (data) => {
  const hero = data.hero ?? {};
  const form = data.form ?? {};
  const details = data.details ?? {};

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        <p>${escapeHtml(hero.intro)}</p>
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-2'>
        <div class='card'>
          <h2>${escapeHtml(form.title)}</h2>
          <form class='contact-form' name='contact' method='POST' data-netlify='true' netlify-honeypot='bot-field' action='/thank-you.html'>
            <input type='hidden' name='form-name' value='contact'>
            <p style='display:none;'>
              <label>Do not fill this out: <input name='bot-field'></label>
            </p>
            <input class='input' type='text' name='name' placeholder='${escapeHtml(form.namePlaceholder)}' required>
            <input class='input' type='email' name='email' placeholder='${escapeHtml(form.emailPlaceholder)}' required>
            <input class='input' type='text' name='phone' placeholder='${escapeHtml(form.phonePlaceholder)}'>
            <textarea name='message' placeholder='${escapeHtml(form.messagePlaceholder)}' required></textarea>
            <button class='btn' type='submit'>${escapeHtml(form.buttonText)}</button>
          </form>
          <p class='small' style='margin-top:12px;'>${escapeHtml(form.note)}</p>
        </div>
        <div class='card'>
          <h2>${escapeHtml(details.title)}</h2>
          <p><strong>Location:</strong> ${escapeHtml(details.location)}</p>
          <p><strong>Email:</strong> ${escapeHtml(details.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(details.phone)}</p>
          <p><strong>Hours:</strong> ${escapeHtml(details.hours)}</p>
          <p><strong>Consultations:</strong> ${escapeHtml(details.consultations)}</p>
        </div>
      </div>
    </section>
  `;
};

const renderers = {
  home: renderHome,
  faq: renderFaq,
  approach: renderApproach,
  services: renderServices,
  specialties: renderSpecialties,
  "specialties-trauma": renderSpecialtyPage,
  "specialties-emdr": renderSpecialtyPage,
  "specialties-stress-anxiety": renderSpecialtyPage,
  "specialties-depression": renderSpecialtyPage,
  "specialties-grief-loss": renderSpecialtyPage,
  "specialties-couples": renderSpecialtyPage,
  "specialties-somatic-therapy": renderSpecialtyPage,
  "specialties-divorce": renderSpecialtyPage,
  "lp-trauma": renderAdLandingPage,
  "lp-emdr": renderAdLandingPage,
  "lp-stress-anxiety": renderAdLandingPage,
  "lp-depression": renderAdLandingPage,
  "lp-grief-loss": renderAdLandingPage,
  "lp-couples": renderAdLandingPage,
  "lp-somatic-therapy": renderAdLandingPage,
  "lp-divorce": renderAdLandingPage,
  "anxiety-therapy-san-marcos": renderLocalLanding,
  "trauma-therapy-san-marcos": renderLocalLanding,
  "couples-therapy-san-marcos": renderLocalLanding,
  "family-therapy-san-marcos": renderLocalLanding,
  "holistic-therapy-san-marcos": renderLocalLanding,
  "online-therapy-california": renderLocalLanding,
  "teen-therapy-san-marcos": renderLocalLanding,
  about: renderAbout,
  reviews: renderReviews,
  contact: renderContact,
};

const loadPageContent = async () => {
  const root = document.querySelector("#main-content");
  if (!root) {
    return;
  }

  const page = root.dataset.page;
  const render = renderers[page];
  if (!page || !render) {
    root.innerHTML = "<section class='section'><div class='container'><div class='card'>Page content is not configured.</div></div></section>";
    return;
  }

  // If the page was prerendered at build time, skip the runtime fetch.
  if (root.innerHTML.includes("prerender:begin")) {
    return;
  }

  try {
    const response = await fetch(`content/${page}.md`, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Unable to load content/${page}.md`);
    }
    const raw = await response.text();
    const data = parseFrontmatter(raw);
    root.innerHTML = render(data);
  } catch (error) {
    console.error(error);
    root.innerHTML = "<section class='section'><div class='container'><div class='card'>Content failed to load. Check your Markdown files.</div></div></section>";
  }
};

const initHeroVideoPlayback = () => {
  const video = document.querySelector(".hero-video");
  if (!video) {
    return;
  }

  // Some browsers require an explicit play() call even with autoplay+muted.
  const tryPlay = () => {
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        // Keep static fallback poster/background if playback is blocked.
      });
    }
  };

  tryPlay();
  document.addEventListener("click", tryPlay, { once: true });
  document.addEventListener("touchstart", tryPlay, { once: true });
};

loadPageContent().then(initHeroVideoPlayback);
