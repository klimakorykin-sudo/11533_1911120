// ============================================================
// СЧЁТЧИК — ТЫ ЗДЕСЬ УЖЕ N МИНУТ
// ============================================================

(function () {

  const el = document.getElementById("time-spent");
  if (!el) return;

  const start = Date.now();

  function update() {
    const diff = Math.floor((Date.now() - start) / 1000);

    let text;

    if (diff < 60) {
      text = `${diff} сек`;
    } else if (diff < 3600) {
      const min = Math.floor(diff / 60);
      const sec = diff % 60;
      text = `${min} мин ${sec} сек`;
    } else {
      const hours = Math.floor(diff / 3600);
      const min = Math.floor((diff % 3600) / 60);
      text = `${hours} ч ${min} мин`;
    }

    el.textContent = text;
  }

  update();
  setInterval(update, 1000);

})();