// ============================================================
// ЛАЙТБОКС — увеличение фото + листание
// ============================================================

(function () {

  const items = document.querySelectorAll(".gallery-item img");
  if (items.length === 0) return;

  const images = Array.from(items).map(img => ({
    src: img.src,
    alt: img.alt
  }));

  let currentIndex = 0;

  // Создаём оверлей
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <span class="lightbox-close">×</span>
    <span class="lightbox-arrow lightbox-prev">‹</span>
    <img class="lightbox-img" src="" alt="">
    <span class="lightbox-arrow lightbox-next">›</span>
    <span class="lightbox-counter"></span>
  `;
  document.body.appendChild(overlay);

  const lightboxImg = overlay.querySelector(".lightbox-img");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");
  const counter = overlay.querySelector(".lightbox-counter");

  // Показать фото по индексу
  function showImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentIndex = index;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    counter.textContent = `${index + 1} / ${images.length}`;
  }

  // Открыть
  items.forEach((img, i) => {
    img.addEventListener("click", () => {
      showImage(i);
      overlay.classList.add("open");
    });
  });

  // Закрыть
  function closeLightbox() {
    overlay.classList.remove("open");
    setTimeout(() => {
      lightboxImg.src = "";
    }, 300);
  }

  closeBtn.addEventListener("click", closeLightbox);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Стрелки
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  // Клавиши
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  // Свайпы
  let touchStartX = 0;
  let touchEndX = 0;

  overlay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  overlay.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      showImage(currentIndex + 1);
    } else {
      showImage(currentIndex - 1);
    }
  }

})();