// ============================================================
// КАРУСЕЛЬ ФОТО
// ============================================================

(function () {

  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsContainer = document.getElementById("carouselDots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll(".carousel-slide");
  const total = slides.length;
  let current = 0;

  // Создаём точки
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".carousel-dot");

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    update();
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // Автопрокрутка каждые 5 секунд
  let autoplay = setInterval(() => goTo(current + 1), 5000);

  // Пауза при наведении
  const carousel = track.parentElement;
  carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
  carousel.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  });

  // Свайп на телефоне
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  // Клавиши
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  update();

})();