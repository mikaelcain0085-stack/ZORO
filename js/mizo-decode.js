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
    el.classList.add("is-decoding");

    const chars = targetText.split("");
    const revealed = new Array(chars.length).fill(false);
    const timeoutIds = [];

    chars.forEach((ch, i) => {
      if (ch === " ") {
        revealed[i] = true;
        return;
      }
      timeoutIds.push(
        setTimeout(() => {
          revealed[i] = true;
        }, startDelay + i * REVEAL_STAGGER)
      );
    });

    const totalDuration = startDelay + chars.length * REVEAL_STAGGER + 150;

    const intervalId = setInterval(() => {
      el.textContent = chars
        .map((ch, i) => (revealed[i] ? ch : randomGlyph()))
        .join("");
    }, STEP_MS);

    timeoutIds.push(
      setTimeout(() => {
        clearInterval(intervalId);
        el.textContent = targetText;
        el.classList.remove("is-decoding");
      }, totalDuration)
    );

    state.set(el, { intervalId, timeoutIds });
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
                decodeTo(el, el.dataset.mi, i * ELEMENT_STAGGER);
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
