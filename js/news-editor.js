// ZORO — Newspaper-style admin News editor (Part 2)
// Rich text editing via Quill, a live preview pane, paragraph
// reordering, and a Draft/Publish workflow. Uses the same Django
// backend functions as everything else (createNews / updateNewsApi /
// getNews / deleteNews, defined in app.js) — no localStorage for
// article data, only real shared storage.

(function () {
  let quill = null;

  // ---- category select (with "Other/custom" support) ----

  const categorySelectEl = document.getElementById("newsCategory");
  const categoryCustomEl = document.getElementById("newsCategoryCustom");

  function getSelectedCategory() {
    if (categorySelectEl.value === "__custom__") {
      return categoryCustomEl.value.trim() || "General";
    }
    return categorySelectEl.value;
  }

  function setSelectedCategory(value) {
    const presetValues = Array.from(categorySelectEl.options)
      .map((o) => o.value)
      .filter((v) => v !== "__custom__");

    if (value && !presetValues.includes(value)) {
      categorySelectEl.value = "__custom__";
      categoryCustomEl.value = value;
      categoryCustomEl.style.display = "block";
    } else {
      categorySelectEl.value = value || "General";
      categoryCustomEl.value = "";
      categoryCustomEl.style.display = "none";
    }
  }

  categorySelectEl.addEventListener("change", () => {
    categoryCustomEl.style.display =
      categorySelectEl.value === "__custom__" ? "block" : "none";
    renderLivePreview();
  });

  categoryCustomEl.addEventListener("input", renderLivePreview);

  // ---- Quill setup ----

  function initQuill() {
    if (quill || typeof Quill === "undefined") return;

    quill = new Quill("#npQuillEditor", {
      theme: "snow",
      placeholder: "Write the full news story here...",
      modules: {
        toolbar: {
          container: [
            [{ header: [2, 3, false] }],
            ["bold", "italic"],
            [{ align: [] }],
            ["blockquote"],
            ["image"],
            ["clean"],
          ],
          handlers: {
            image: insertImageHandler,
          },
        },
      },
    });

    quill.on("text-change", () => {
      renderOutline();
      renderLivePreview();
    });
  }

  function insertImageHandler() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", reader.result, "user");
        quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // ---- paragraph outline / reordering ----
  // (Move Up/Down rather than true drag-and-drop — see note in chat:
  // real DnD inside a rich-text editor fights the editor's own
  // undo/selection state and is prone to breaking in edge cases.)

  function getTopLevelBlocks() {
    const editor = document.querySelector("#npQuillEditor .ql-editor");
    if (!editor) return [];
    return Array.from(editor.children).filter((el) => el.tagName !== "BR");
  }

  function renderOutline() {
    const listEl = document.getElementById("npOutlineList");
    if (!listEl) return;

    const blocks = getTopLevelBlocks();

    if (blocks.length === 0) {
      listEl.innerHTML =
        '<p style="font-size:0.8rem;color:var(--text-muted);margin:0;">Start writing to see paragraph order here.</p>';
      return;
    }

    listEl.innerHTML = blocks
      .map((block, i) => {
        const text = block.textContent.trim().slice(0, 60) || "(image / empty block)";
        return `
          <div class="np-outline-item">
            <button type="button" class="np-outline-move" data-dir="up" data-index="${i}" ${
          i === 0 ? "disabled" : ""
        }>↑</button>
            <button type="button" class="np-outline-move" data-dir="down" data-index="${i}" ${
          i === blocks.length - 1 ? "disabled" : ""
        }>↓</button>
            <span class="np-outline-text">${escapeHtml(text)}</span>
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll(".np-outline-move").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const targetIndex = btn.dataset.dir === "up" ? index - 1 : index + 1;
        moveBlock(index, targetIndex);
      });
    });
  }

  function moveBlock(fromIndex, toIndex) {
    const blocks = getTopLevelBlocks();
    if (toIndex < 0 || toIndex >= blocks.length) return;

    const reordered = blocks.slice();
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const newHtml = reordered.map((n) => n.outerHTML).join("");

    // Use Quill's own sanctioned API for setting HTML programmatically,
    // rather than mutating the live contenteditable DOM directly.
    quill.setContents([]);
    quill.clipboard.dangerouslyPasteHTML(newHtml, "user");

    renderOutline();
    renderLivePreview();
  }

  // ---- live preview ----

  function renderLivePreview() {
    const previewEl = document.getElementById("npPreviewCard");
    if (!previewEl) return;

    const title = document.getElementById("newsTitle").value.trim();
    const subheadline = document.getElementById("newsSubheadline").value.trim();
    const author = document.getElementById("newsAuthor").value.trim();
    const category = getSelectedCategory();
    const previewImg = document.getElementById("imagePreview");
    const hasImage = previewImg.classList.contains("show");

    if (!title) {
      previewEl.innerHTML =
        '<p class="np-preview-empty">Start filling in the headline to see a live preview.</p>';
      return;
    }

    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    previewEl.innerHTML = `
      <div class="np-lead" style="border:none; padding:0; margin:0; cursor:default;">
        ${
          hasImage
            ? `<img src="${previewImg.src}" style="width:100%; height:160px; object-fit:cover; filter:grayscale(1) contrast(1.05); border:1px solid #000; margin-bottom:0.8rem;">`
            : ""
        }
        <span class="np-eyebrow">${escapeHtml(category)}</span>
        <h2 style="font-size:1.4rem;">${escapeHtml(title)}</h2>
        ${
          subheadline
            ? `<p class="np-sub" style="font-size:0.95rem;">${escapeHtml(
                subheadline
              )}</p>`
            : ""
        }
        <span class="np-byline">${
          author ? "By " + escapeHtml(author) + " — " : ""
        }${dateStr}</span>
      </div>
    `;
  }

  ["newsTitle", "newsSubheadline", "newsAuthor", "newsCategory"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", renderLivePreview);
    }
  );

  // refresh the preview once the main image finishes loading/clearing
  // (app.js owns the actual upload/FileReader logic for #imagePreview)
  document
    .getElementById("imagePreview")
    .addEventListener("load", renderLivePreview);

  document
    .getElementById("removeImageBtn")
    .addEventListener("click", () => setTimeout(renderLivePreview, 0));

  // ---- submit (Draft / Publish) ----

  function getFormFields() {
    return {
      title: document.getElementById("newsTitle").value.trim(),
      subheadline: document.getElementById("newsSubheadline").value.trim(),
      author: document.getElementById("newsAuthor").value.trim(),
      category: getSelectedCategory(),
      publish_date: document.getElementById("newsPublishDate").value || "",
      is_front_page: document.getElementById("newsIsFrontPage").checked,
      is_featured: document.getElementById("newsIsFeatured").checked,
      columns: document.querySelector('input[name="newsColumns"]:checked')
        .value,
      content: quill ? quill.root.innerHTML : "",
    };
  }

  async function submitNews(status) {
    const fields = getFormFields();

    if (!fields.title) {
      alert("Please enter a headline.");
      return;
    }

    const formData = new FormData();
    formData.append("title", fields.title);
    formData.append("subheadline", fields.subheadline);
    formData.append("author", fields.author);
    formData.append("category", fields.category);
    if (fields.publish_date) {
      formData.append("publish_date", fields.publish_date);
    }
    formData.append("is_front_page", fields.is_front_page);
    formData.append("is_featured", fields.is_featured);
    formData.append("columns", fields.columns);
    formData.append("content", fields.content);
    formData.append("status", status);

    if (newsImageInput.files && newsImageInput.files[0]) {
      formData.append("image", newsImageInput.files[0]);
    }

    if (currentPdfFile) {
      formData.append("pdf", currentPdfFile);
    }

    const editId = editingNewsId.value;

    try {
      if (editId) {
        await updateNewsApi(editId, formData);
        newsSuccessToast.textContent =
          status === "draft"
            ? "Saved as draft!"
            : "News updated successfully!";
      } else {
        await createNews(formData);
        newsSuccessToast.textContent =
          status === "draft"
            ? "Saved as draft!"
            : "News published successfully!";
      }

      await renderNewsAdmin();
      resetNewsForm();

      newsSuccessToast.classList.add("show");
      setTimeout(() => {
        newsSuccessToast.classList.remove("show");
      }, 2500);
    } catch (error) {
      console.error(error);
      alert(
        "Could not save news. Please make sure the Django server is running."
      );
    }
  }

  document.getElementById("newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    submitNews("published");
  });

  document
    .getElementById("newsSaveDraftBtn")
    .addEventListener("click", () => {
      submitNews("draft");
    });

  // ---- overrides: reset / edit / admin list ----
  // (these redefine the plain `function` declarations from app.js —
  // safe because every call site in app.js invokes them by name at
  // call time, not by a captured reference at page-load time)

  window.resetNewsForm = function resetNewsForm() {
    document.getElementById("newsForm").reset();
    editingNewsId.value = "";
    setSelectedCategory("General");
    document.getElementById("newsIsFrontPage").checked = false;
    document.getElementById("newsIsFeatured").checked = false;
    document.querySelector(
      'input[name="newsColumns"][value="2"]'
    ).checked = true;

    if (quill) {
      quill.setContents([]);
    }

    newsFormTitle.textContent = "Upload News";
    newsSubmitBtn.textContent = "Publish News";
    cancelEditBtn.style.display = "none";

    clearImageUpload();
    clearPdfUpload();

    renderOutline();
    renderLivePreview();
  };

  window.startEditNews = async function startEditNews(id) {
    const news = await getNews();
    const item = news.find((n) => n.id === id);
    if (!item) return;

    editingNewsId.value = id;

    document.getElementById("newsTitle").value = item.title || "";
    document.getElementById("newsSubheadline").value = item.subheadline || "";
    document.getElementById("newsAuthor").value = item.author || "";
    setSelectedCategory(item.category || "General");
    document.getElementById("newsPublishDate").value = item.publish_date || "";
    document.getElementById("newsIsFrontPage").checked = !!item.is_front_page;
    document.getElementById("newsIsFeatured").checked = !!item.is_featured;

    const colValue = String(item.columns) === "3" ? "3" : "2";
    document.querySelector(
      `input[name="newsColumns"][value="${colValue}"]`
    ).checked = true;

    if (quill) {
      quill.setContents([]);
      const content = item.content || "";
      const looksLikeHtml = /<[a-z][\s\S]*>/i.test(content);

      if (looksLikeHtml) {
        quill.clipboard.dangerouslyPasteHTML(content, "user");
      } else {
        // legacy plain-text article (from the old form) — wrap into
        // paragraphs so it edits/displays sensibly in the rich editor
        const html = content
          .split(/\n{2,}/)
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("");
        quill.clipboard.dangerouslyPasteHTML(html, "user");
      }
    }

    newsFormTitle.textContent = "Edit News";
    newsSubmitBtn.textContent = "Update News";
    cancelEditBtn.style.display = "block";

    if (item.image) {
      setImagePreview(item.image);
    } else {
      clearImageUpload();
    }

    switchAdminSubview("newsUploadView");

    renderOutline();
    renderLivePreview();

    document.getElementById("newsTitle").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  document.getElementById("cancelEditBtn").addEventListener("click", () => {
    resetNewsForm();
  });

  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || "";
  }

  window.renderNewsAdmin = async function renderNewsAdmin() {
    const news = await getNews();

    newsCount.textContent = news.length;

    if (news.length === 0) {
      newsList.innerHTML = `
        <div class="empty-state">
          <span>📰</span>
          No news yet. Publish the first one!
        </div>
      `;
      return;
    }

    newsList.innerHTML = news
      .map((item) => {
        const excerpt = stripHtml(item.content).trim().slice(0, 100);
        return `
          <div class="news-card">

            <div class="news-card-left">

              ${
                item.image
                  ? `<img class="thumb" src="${item.image}" alt="">`
                  : ""
              }

              <div class="news-info">

                <h3>${escapeHtml(item.title)}</h3>

                <p>
                  ${escapeHtml(excerpt)}${excerpt.length >= 100 ? "…" : ""}
                </p>

                <span class="news-date">
                  ${formatDate(item.created_at)}
                </span>

                <span class="leader-admin-status-badge ${
                  item.status === "draft" ? "previous" : "current"
                }">
                  ${item.status === "draft" ? "Draft" : "Published"}
                </span>

                ${
                  item.is_front_page
                    ? '<span class="leader-admin-status-badge current">Front Page</span>'
                    : ""
                }

              </div>

            </div>

            <div class="card-actions">
              <button class="btn-edit" data-id="${item.id}">Edit</button>
              <button class="btn-delete" data-id="${item.id}">Delete</button>
            </div>

          </div>
        `;
      })
      .join("");

    newsList.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        startEditNews(Number(btn.dataset.id));
      });
    });

    newsList.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this news article?")) return;
        await deleteNews(Number(btn.dataset.id));
        await renderNewsAdmin();
      });
    });
  };

  function init() {
    initQuill();
    renderOutline();
    renderLivePreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
