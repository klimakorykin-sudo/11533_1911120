// ============================================================
// КУРСОР — всегда свой
// ============================================================

(function () {

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  const trailCount = 12;
  const trail = [];

  for (let i = 0; i < trailCount; i++) {
    const t = document.createElement("div");
    t.className = "cursor-trail";
    document.body.appendChild(t);
    trail.push({ el: t, x: 0, y: 0 });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animate() {
    let prevX = mouseX;
    let prevY = mouseY;

    trail.forEach((t) => {
      t.x += (prevX - t.x) * 0.35;
      t.y += (prevY - t.y) * 0.35;
      t.el.style.transform = `translate(${t.x}px, ${t.y}px)`;
      prevX = t.x;
      prevY = t.y;
    });

    requestAnimationFrame(animate);
  }

  animate();

})();