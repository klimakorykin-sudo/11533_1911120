// ============================================================
// МУЗЫКА — включение / выключение
// ============================================================

(function () {

  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("musicBtn");

  if (!audio || !btn) return;

  const KEY = "anya_music_on";

  // Восстановить состояние
  const savedState = localStorage.getItem(KEY);

  if (savedState === "true") {
    // Пробуем включить (может не сработать без клика — браузеры блокируют автоплей)
    audio.play().then(() => {
      btn.textContent = "🔊";
      btn.classList.add("playing");
    }).catch(() => {
      // Автоплей заблокирован — ждём клика
      btn.textContent = "🔇";
      btn.classList.remove("playing");
    });
  } else {
    btn.textContent = "🔇";
  }

  // Клик
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = "🔊";
      btn.classList.add("playing");
      localStorage.setItem(KEY, "true");
    } else {
      audio.pause();
      btn.textContent = "🔇";
      btn.classList.remove("playing");
      localStorage.setItem(KEY, "false");
    }
  });

})();