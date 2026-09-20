// ============================================================
// ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ ПРОКРУТКЕ
// ============================================================

(function () {

  const sections = document.querySelectorAll(".section");
  if (sections.length === 0) return;

  // Добавляем класс для начального состояния
  sections.forEach(s => s.classList.add("reveal-hidden"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        entry.target.classList.remove("reveal-hidden");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  sections.forEach(s => observer.observe(s));

})();