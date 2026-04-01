import { load as parseYaml } from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js";

const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => links.classList.toggle("show"));
}

marked.setOptions({ breaks: true });

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const md = (value) => marked.parse(String(value ?? ""));

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
  const faq = data.faq ?? {};
  const faqItems = Array.isArray(faq.items) ? faq.items : [];
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
        <div class='grid-3'>
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

const renderApproach = (data) => {
  const hero = data.hero ?? {};
  const sectionOne = data.sectionOne ?? {};
  const pillars = Array.isArray(data.pillars) ? data.pillars : [];
  const process = data.process ?? {};
  const steps = Array.isArray(process.steps) ? process.steps : [];

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
        ${md(hero.intro)}
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

    <section class='section compact'>
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
    </section>

    <section class='section'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(process.eyebrow)}</div>
        <h2>${escapeHtml(process.title)}</h2>
        <div class='grid-3'>
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

    <section class='section compact'>
      <div class='container'>
        <div class='notice'>${escapeHtml(data.note)}</div>
      </div>
    </section>
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
      <div class='container grid-2'>
        ${primary
          .map(
            (item) => `
          <article class='card'>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>

    <section class='section compact'>
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
    </section>
  `;
};

const renderAbout = (data) => {
  const hero = data.hero ?? {};
  const bio = data.bio ?? {};
  const bullets = Array.isArray(bio.bullets) ? bio.bullets : [];
  const values = Array.isArray(data.values) ? data.values : [];

  return `
    <section class='page-hero'>
      <div class='container'>
        <div class='eyebrow'>${escapeHtml(hero.eyebrow)}</div>
        <h1>${escapeHtml(hero.title)}</h1>
      </div>
    </section>

    <section class='section compact'>
      <div class='container grid-2'>
        <div class='image-card'><img src='${escapeHtml(bio.imageSrc)}' alt='${escapeHtml(bio.imageAlt)}'></div>
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
          <form class='contact-form'>
            <input class='input' type='text' placeholder='${escapeHtml(form.namePlaceholder)}'>
            <input class='input' type='email' placeholder='${escapeHtml(form.emailPlaceholder)}'>
            <input class='input' type='text' placeholder='${escapeHtml(form.phonePlaceholder)}'>
            <textarea placeholder='${escapeHtml(form.messagePlaceholder)}'></textarea>
            <button class='btn' type='button'>${escapeHtml(form.buttonText)}</button>
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
  approach: renderApproach,
  services: renderServices,
  about: renderAbout,
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

loadPageContent();
