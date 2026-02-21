(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  function setAccordionState(item, open) {
    item.classList.toggle("is-open", open);
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;
    trigger.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  }

  function initAccordion(root, options) {
    const items = Array.from(root.querySelectorAll(".accordion-item"));
    if (!items.length) return;

    const closeOthers = options && options.closeOthers;
    const onChange = options && options.onChange;

    items.forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        if (closeOthers) {
          items.forEach((other) => setAccordionState(other, other === item ? !isOpen : false));
        } else {
          setAccordionState(item, !isOpen);
        }

        const openItem = items.find((entry) => entry.classList.contains("is-open"));
        if (onChange && openItem) onChange(openItem);
      });
    });

    const openItem = items.find((entry) => entry.classList.contains("is-open")) || items[0];
    items.forEach((item) => setAccordionState(item, item === openItem));
    if (onChange && openItem) onChange(openItem);

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const openItemEsc = items.find((entry) => entry.classList.contains("is-open"));
      if (!openItemEsc) return;
      setAccordionState(openItemEsc, false);
    });
  }

  function initRecruiterSignals() {
    const root = document.querySelector('[data-accordion="signals"]');
    const proofText = document.getElementById("proofText");
    const proofLink1 = document.getElementById("proofLink1");
    const proofLink2 = document.getElementById("proofLink2");

    if (!root || !proofText || !proofLink1 || !proofLink2) return;

    const proofMap = {
      core: {
        text: "I prove this through robust Python/SQL workflows and reproducible modeling pipelines.",
        link1: { label: "Market Inefficiency Finder", href: "projects/market-inefficiencies-pipeline.html" },
        link2: { label: "Multifractal Forecasting", href: "projects/fractal-vol-forecast.html" }
      },
      bi: {
        text: "I prove this through dashboard modeling, KPI design, and traceable data flows in portfolio analytics.",
        link1: { label: "Portfolio Risk Dashboard", href: "projects/portfolio-risk-dashboard.html" },
        link2: { label: "All Projects", href: "projects.html" }
      },
      markets: {
        text: "I prove this by quantifying market frictions/dislocations and communicating risk behavior with stress views.",
        link1: { label: "Market Inefficiency Finder", href: "projects/market-inefficiencies-pipeline.html" },
        link2: { label: "Portfolio Risk Dashboard", href: "projects/portfolio-risk-dashboard.html" }
      },
      rigor: {
        text: "I prove this with strong baselines, out-of-sample testing, and horizon-by-horizon evaluation.",
        link1: { label: "Multifractal Forecasting", href: "projects/fractal-vol-forecast.html" },
        link2: { label: "Market Inefficiency Finder", href: "projects/market-inefficiencies-pipeline.html" }
      },
      communication: {
        text: "I prove this by converting technical outputs into clear dashboards, concise write-ups, and recruiter-ready summaries.",
        link1: { label: "Portfolio Risk Dashboard", href: "projects/portfolio-risk-dashboard.html" },
        link2: { label: "Experience", href: "experience.html" }
      }
    };

    initAccordion(root, {
      closeOthers: true,
      onChange: (openItem) => {
        const key = openItem.dataset.signal;
        const cfg = proofMap[key];
        if (!cfg) return;
        proofText.textContent = cfg.text;
        proofLink1.textContent = cfg.link1.label;
        proofLink1.href = cfg.link1.href;
        proofLink2.textContent = cfg.link2.label;
        proofLink2.href = cfg.link2.href;
      }
    });
  }

  function initTimelineAccordion() {
    const root = document.querySelector('[data-accordion="timeline"]');
    if (!root) return;
    initAccordion(root, { closeOthers: true });
  }

  initReveal();
  initRecruiterSignals();
  initTimelineAccordion();
})();
