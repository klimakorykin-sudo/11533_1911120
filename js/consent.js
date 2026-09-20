// ============================================================
// ЭКРАН ДОВЕРИЯ — один раз
// ============================================================

(function () {

  const overlay = document.getElementById("consentOverlay");
  const acceptBtn = document.getElementById("consentAccept");
  const declineBtn = document.getElementById("consentDecline");
  const errorDiv = document.getElementById("consentError");

  if (!overlay || !acceptBtn || !declineBtn) return;

  const KEY = "anya_consent";

  // Если уже принял — скрываем
  if (localStorage.getItem(KEY) === "true") {
    overlay.classList.add("hidden");
  }

  // Принимаю
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem(KEY, "true");
    overlay.classList.add("hidden");
    errorDiv.textContent = "";
  });

  // Не принимаю
  declineBtn.addEventListener("click", () => {
    errorDiv.textContent = "❌ Ты не принял(а) условия. Доступ закрыт.";
    setTimeout(() => {
      errorDiv.textContent = "❌ Если считаешь Аню злой или несправедливой — тебе сюда нельзя.";
    }, 2500);
    setTimeout(() => {
      location.reload();
    }, 5000);
  });

})();