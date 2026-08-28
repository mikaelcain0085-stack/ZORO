// ZORO — donation section background video
// Only loads/plays while the visitor has actually scrolled to the
// donate section; pauses again once it's scrolled out of view.
(function () {
  const video = document.querySelector(".donate-video");
  if (!video) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay can be blocked in rare cases (e.g. low-power
            // mode) — the poster/overlay still looks fine either way.
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.2 }
  );

  io.observe(video);
})();
