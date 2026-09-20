(function () {
  const KEY = "anya_new_badge_shown";
  if (localStorage.getItem(KEY) === "true") return;

  const cards = document.querySelectorAll('.project-card[data-new="true"]');
  cards.forEach(card => {
    const badge = document.createElement("span");
    badge.className = "badge-new";
    badge.textContent = "НОВОЕ";
    card.appendChild(badge);
  });

  localStorage.setItem(KEY, "true");
})();