// ZORO — background videos (donate + contact sections)
// Each only loads/plays while it's actually scrolled into view;
// pauses again once scrolled out of view, to save bandwidth/battery.
(function () {
  const videos = document.querySelectorAll(".bg-scroll-video");
  if (!videos.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay can be blocked in rare cases (e.g. low-power
            // mode) — the overlay still looks fine either way.
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.2 }
  );

  videos.forEach((video) => io.observe(video));
})();
