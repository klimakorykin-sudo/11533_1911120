// ============================================================
// СЧЁТЧИК — только заходы
// ============================================================

(function () {

  const visitEl = document.getElementById("visit-count");
  if (!visitEl) return;

  const KEY = "anya_visit_count";

  let visits = parseInt(localStorage.getItem(KEY) || "0", 10);
  visits += 1;
  localStorage.setItem(KEY, visits.toString());

  visitEl.textContent = visits;

})();