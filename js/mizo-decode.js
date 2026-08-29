// ZORO — English -> Mizo "decode" text animation
// Every time a public section (News/Gallery/Leaders/Members) scrolls
// into view, its text scrambles through random characters before
// settling into the Mizo version. Resets instantly back to English
// when scrolled out of view, ready to replay on the next visit.

(function () {
  const GLYPHS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&+=";
  const STEP_MS = 35; // how often each character's glyph flickers
  const REVEAL_STAGGER = 26; // ms between each character locking in, left to right
  const ELEMENT_STAGGER = 90; // ms between each element in a section starting
  const HOLD_ENGLISH_MS = 1500; // how long English stays visible before decoding starts

  const state = new WeakMap(); // element -> { intervalId, timeoutIds }

  function randomGlyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  function stopAnimation(el) {
    const s = state.get(el);
    if (!s) return;
    if (s.intervalId) clearInterval(s.intervalId);
    s.timeoutIds.forEach(clearTimeout);
    state.delete(el);
  }

  function decodeTo(el, targetText, startDelay) {
    stopAnimation(el);

    const s = { intervalId: null, timeoutIds: [] };
    state.set(el, s);

    // Phase 1: do nothing — English stays fully visible/untouched.
    const beginId = setTimeout(() => {
      // Phase 2: scramble reveal into the Mizo text.
      el.classList.add("is-decoding");

      const chars = targetText.split("");
      const revealed = new Array(chars.length).fill(false);

      chars.forEach((ch, i) => {
        if (ch === " ") {
          revealed[i] = true;
          return;
        }
        s.timeoutIds.push(
          setTimeout(() => {
            revealed[i] = true;
          }, i * REVEAL_STAGGER)
        );
      });

      const scrambleDuration = chars.length * REVEAL_STAGGER + 150;

      s.intervalId = setInterval(() => {
        el.textContent = chars
          .map((ch, i) => (revealed[i] ? ch : randomGlyph()))
          .join("");
      }, STEP_MS);

      s.timeoutIds.push(
        setTimeout(() => {
          clearInterval(s.intervalId);
          s.intervalId = null;
          el.textContent = targetText;
          el.classList.remove("is-decoding");
        }, scrambleDuration)
      );
    }, startDelay);

    s.timeoutIds.push(beginId);
  }

  function resetToEnglish(el, englishText) {
    stopAnimation(el);
    el.classList.remove("is-decoding");
    el.textContent = englishText;
  }

  function init() {
    const sections = document.querySelectorAll(".explore-screen");

    sections.forEach((section) => {
      const targets = Array.from(section.querySelectorAll(".decode-text"));
      if (!targets.length) return;

      targets.forEach((el) => {
        if (!el.dataset.en) {
          el.dataset.en = el.textContent.trim().replace(/\s+/g, " ");
        }
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              targets.forEach((el, i) => {
                decodeTo(el, el.dataset.mi, HOLD_ENGLISH_MS + i * ELEMENT_STAGGER);
              });
            } else {
              targets.forEach((el) => {
                resetToEnglish(el, el.dataset.en);
              });
            }
          });
        },
        { threshold: 0.4 }
      );

      io.observe(section);
    });
  }

  function initSectionTitle() {
    const title = document.querySelector(".section-title");
    if (!title) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            title.classList.add("is-visible");
            io.disconnect(); // one-time reveal, not repeated
          }
        });
      },
      { threshold: 0.5 }
    );

    io.observe(title);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      initSectionTitle();
    });
  } else {
    init();
    initSectionTitle();
  }
})();
