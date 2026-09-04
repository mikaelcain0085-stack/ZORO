// ZORO — "The ZORO Herald" newspaper-style public News page
// Reads from the real Django backend (API_BASE / getNews, defined in
// app.js) — nothing here uses localStorage for article data, only for
// remembering the visitor's e-ink toggle preference.

(function () {
  let allPublished = [];
  let filtered = [];
  let activeCategory = "all";
  let searchTerm = "";
  let readerIndex = -1; // index into `filtered`, -1 = front page view

  const frontpageEl = document.getElementById("npFrontpage");
  const readerEl = document.getElementById("npReader");
  const articleContentEl = document.getElementById("npArticleContent");
  const tabsEl = document.getElementById("npCategoryTabs");
  const searchInputEl = document.getElementById("npSearchInput");
  const countEl = document.getElementById("npArticleCount");
  const dateEl = document.getElementById("npMastheadDate");
  const progressEl = document.getElementById("npReadingProgress");
  const einkToggleEl = document.getElementById("npEinkToggle");
  const shellEl = document.getElementById("news");
  const prevBtn = document.getElementById("npPrevArticle");
  const nextBtn = document.getElementById("npNextArticle");
  const readerBackBtn = document.getElementById("npReaderBack");

  function npFormatDate(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  function npEscapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  function stripHtmlToText(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || "";
  }

  // Subheadline, title, and author are plain-text fields — they
  // should never contain real HTML. If tag-like text ends up in one
  // (typed/pasted by mistake, or from any other source), strip it
  // rather than showing raw "<p>...</p>" characters to readers.
  function plainTextOnly(value) {
    return (value || "").replace(/<\/?[a-z][^>]*>/gi, "").trim();
  }

  function plainExcerpt(text, max) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    return clean.length > max ? clean.slice(0, max).trim() + "…" : clean;
  }

  // ---- e-ink mode (UI preference only, not article data) ----
  function applyEinkPreference() {
    const on = localStorage.getItem("zoro_np_eink") === "1";
    shellEl.classList.toggle("np-eink-mode", on);
  }

  einkToggleEl.addEventListener("click", () => {
    const on = shellEl.classList.toggle("np-eink-mode");
    localStorage.setItem("zoro_np_eink", on ? "1" : "0");
  });

  // ---- data ----
  async function loadArticles() {
    const all = typeof getNews === "function" ? await getNews() : [];
    allPublished = (all || []).filter(
      (a) => (a.status || "published") === "published"
    );
  }

  function applyFilters() {
    filtered = allPublished.filter((a) => {
      const matchesCategory =
        activeCategory === "all" ||
        (a.category || "General").toLowerCase() ===
          activeCategory.toLowerCase();

      const haystack = `${a.title} ${a.subheadline || ""} ${
        a.content || ""
      }`.toLowerCase();
      const matchesSearch =
        !searchTerm || haystack.includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    // newest first
    filtered.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  function renderCategoryTabs() {
    const categories = Array.from(
      new Set(allPublished.map((a) => a.category || "General"))
    ).sort();

    tabsEl.innerHTML =
      `<button type="button" class="np-tab${
        activeCategory === "all" ? " active" : ""
      }" data-category="all">All</button>` +
      categories
        .map(
          (cat) => `
        <button
          type="button"
          class="np-tab${
            activeCategory.toLowerCase() === cat.toLowerCase()
              ? " active"
              : ""
          }"
          data-category="${npEscapeHtml(cat)}"
        >
          ${npEscapeHtml(cat)}
        </button>
      `
        )
        .join("");

    tabsEl.querySelectorAll(".np-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        applyFilters();
        renderCategoryTabs();
        renderFrontPage();
      });
    });
  }

  function articleCard(article, isLead) {
    const title = plainTextOnly(article.title);
    const subheadline = plainTextOnly(article.subheadline);
    const author = plainTextOnly(article.author);

    const img = article.image
      ? `<img src="${article.image}" alt="${npEscapeHtml(title)}">`
      : "";

    const sub = subheadline
      ? `<p class="np-sub">${npEscapeHtml(subheadline)}</p>`
      : `<p class="np-sub">${npEscapeHtml(
          plainExcerpt(article.content, isLead ? 160 : 90)
        )}</p>`;

    if (isLead) {
      return `
        <div class="np-lead" data-id="${article.id}">
          <div class="np-lead-grid">
            <div>${img}</div>
            <div>
              <span class="np-eyebrow">${npEscapeHtml(
                article.category || "General"
              )}</span>
              <h2>${npEscapeHtml(title)}</h2>
              ${sub}
              <span class="np-byline">
                ${author ? "By " + npEscapeHtml(author) + " — " : ""}
                ${npFormatDate(article.publish_date || article.created_at)}
              </span>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="np-card" data-id="${article.id}">
        ${img}
        <span class="np-eyebrow">${npEscapeHtml(
          article.category || "General"
        )}</span>
        <h3>${npEscapeHtml(title)}</h3>
        ${sub}
        <span class="np-byline">
          ${author ? "By " + npEscapeHtml(author) + " — " : ""}
          ${npFormatDate(article.publish_date || article.created_at)}
        </span>
      </div>
    `;
  }

  function renderFrontPage() {
    countEl.textContent =
      filtered.length === 1
        ? "1 article"
        : `${filtered.length} articles`;

    dateEl.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (filtered.length === 0) {
      frontpageEl.className = "np-frontpage np-empty";
      frontpageEl.innerHTML = `
        <p>No articles found${
          searchTerm ? ` for "${npEscapeHtml(searchTerm)}"` : ""
        }.</p>
      `;
      return;
    }

    frontpageEl.className = "np-frontpage";

    // Lead article: prefer front-page-flagged, else most recent
    const frontPageFlagged = filtered.filter((a) => a.is_front_page);
    const lead = frontPageFlagged[0] || filtered[0];
    const rest = filtered.filter((a) => a.id !== lead.id);

    frontpageEl.innerHTML =
      articleCard(lead, true) +
      rest.map((a) => articleCard(a, false)).join("");

    frontpageEl.querySelectorAll("[data-id]").forEach((el) => {
      el.addEventListener("click", () => {
        const id = Number(el.dataset.id);
        const idx = filtered.findIndex((a) => a.id === id);
        if (idx !== -1) openReader(idx);
      });
    });
  }

  // ---- reader view ----
  function renderArticleBody(article) {
    const content = article.content || "";
    const looksLikeHtml = /<[a-z][\s\S]*>/i.test(content);

    if (looksLikeHtml) {
      // Real HTML authored via the admin's rich text editor — the
      // admin console is the only thing that can write this field,
      // so it's trusted the same way the rest of this admin-driven
      // site already trusts admin-entered data. Render it directly.
      return content;
    }

    // Legacy plain-text article (from the old admin form, pre-editor
    // overhaul) — escape it and wrap into paragraphs so it displays
    // the same way it always did, just without relying on
    // white-space:pre-line.
    return content
      .split(/\n{2,}/)
      .map((para) => `<p>${npEscapeHtml(para)}</p>`)
      .join("");
  }

  // Shared article-HTML builder — used by both the public reader
  // view AND the admin's live preview, so the two are guaranteed to
  // match exactly (same function, not two hand-maintained copies).
  function buildArticleHTML(article) {
    const plainLength = stripHtmlToText(article.content || "").length;
    const columnsClass =
      plainLength < 400
        ? "np-cols-1"
        : Number(article.columns) === 3
        ? "np-cols-3"
        : "np-cols-2";

    return `
      <span class="np-article-category">${npEscapeHtml(
        article.category || "General"
      )}</span>
      <h1>${npEscapeHtml(plainTextOnly(article.title))}</h1>
      ${
        article.subheadline
          ? `<p class="np-sub">${npEscapeHtml(
              plainTextOnly(article.subheadline)
            )}</p>`
          : ""
      }
      <div class="np-article-meta">
        ${
          article.author
            ? `<span>By ${npEscapeHtml(
                plainTextOnly(article.author)
              )}</span>`
            : ""
        }
        <span>${npFormatDate(
          article.publish_date || article.created_at
        )}</span>
      </div>
      ${
        article.image
          ? `<img class="np-article-hero" src="${
              article.image
            }" alt="${npEscapeHtml(article.title)}">`
          : ""
      }
      <div class="np-article-body ${columnsClass}">${renderArticleBody(
      article
    )}</div>
    `;
  }

  window.buildNewspaperArticleHTML = buildArticleHTML;

  function renderReader() {
    const article = filtered[readerIndex];
    if (!article) return;

    articleContentEl.innerHTML =
      buildArticleHTML(article) +
      (article.pdf
        ? `<p style="margin-top:1.5rem;">
              <a href="${
                article.pdf.startsWith("http")
                  ? article.pdf
                  : BACKEND_URL + article.pdf
              }" target="_blank" rel="noopener noreferrer" style="font-family:'Inter',sans-serif; font-size:0.85rem;">
                📄 View attached PDF document ↗
              </a>
            </p>`
        : "");

    prevBtn.disabled = readerIndex <= 0;
    nextBtn.disabled = readerIndex >= filtered.length - 1;

    readerEl.scrollTop = 0;
    window.scrollTo(0, 0);
    updateReadingProgress();
  }

  function openReader(index) {
    readerIndex = index;
    frontpageEl.hidden = true;
    readerEl.hidden = false;
    progressEl.style.width = "0%";
    renderReader();
  }

  function closeReader() {
    readerIndex = -1;
    readerEl.hidden = true;
    frontpageEl.hidden = false;
    progressEl.style.width = "0%";
    window.scrollTo(0, 0);
  }

  function updateReadingProgress() {
    if (readerIndex === -1) {
      progressEl.style.width = "0%";
      return;
    }
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressEl.style.width = pct + "%";
  }

  window.addEventListener("scroll", () => {
    if (readerIndex !== -1) updateReadingProgress();
  });

  readerBackBtn.addEventListener("click", closeReader);

  prevBtn.addEventListener("click", () => {
    if (readerIndex > 0) openReader(readerIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (readerIndex < filtered.length - 1) openReader(readerIndex + 1);
  });

  searchInputEl.addEventListener("input", () => {
    searchTerm = searchInputEl.value.trim();
    applyFilters();
    renderFrontPage();
  });

  // ---- public entry point (called from showNewsConsole in app.js) ----
  window.renderNewspaperFrontPage = async function renderNewspaperFrontPage() {
    applyEinkPreference();
    closeReader();

    frontpageEl.hidden = false;
    frontpageEl.className = "np-frontpage np-empty";
    frontpageEl.innerHTML = `
      <div class="np-loading">
        <div class="np-loading-spinner"></div>
        <p>Bringing today's edition to press...</p>
      </div>
    `;

    await loadArticles();
    applyFilters();
    renderCategoryTabs();
    renderFrontPage();
  };
})();
