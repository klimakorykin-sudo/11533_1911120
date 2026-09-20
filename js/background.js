// ============================================================
// ФОН — город с домиками, туман, звёзды, сакура
// ============================================================

const Background = (() => {

  // --- ЗВЁЗДЫ ---
  const starsCanvas = document.createElement("canvas");
  starsCanvas.id = "stars-canvas";
  document.body.prepend(starsCanvas);

  const starsCtx = starsCanvas.getContext("2d");
  let stars = [];

  function initStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;

    stars = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 8000);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStars(time) {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    stars.forEach(s => {
      const twinkle = Math.sin(time * s.speed + s.phase) * 0.5 + 0.5;
      starsCtx.beginPath();
      starsCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(255, 255, 255, ${s.opacity * twinkle})`;
      starsCtx.fill();
    });
  }

  // --- ГОРОД С ДОМИКАМИ ---
  const cityCanvas = document.createElement("canvas");
  cityCanvas.id = "city-canvas";
  document.body.prepend(cityCanvas);

  const cityCtx = cityCanvas.getContext("2d");
  let houses = [];

  function initCity() {
    cityCanvas.width = window.innerWidth;
    cityCanvas.height = window.innerHeight;

    houses = [];
    const baseY = cityCanvas.height;
    let x = -20;

    while (x < cityCanvas.width + 20) {
      const w = Math.random() * 50 + 30;       // ширина домика
      const h = Math.random() * 120 + 60;      // высота домика
      const windows = [];

      // Окна в домике
      const cols = Math.floor(w / 15);
      const rows = Math.floor(h / 20);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (Math.random() > 0.4) {
            windows.push({
              x: c * 15 + 7,
              y: r * 20 + 10,
              on: Math.random() > 0.3,
              flicker: Math.random() * 0.02 + 0.005,
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }

      houses.push({
        x: x,
        y: baseY - h,
        w: w,
        h: h,
        windows: windows
      });

      x += w + Math.random() * 8 + 2;
    }
  }

  function drawCity(time) {
    cityCtx.clearRect(0, 0, cityCanvas.width, cityCanvas.height);

    houses.forEach(house => {
      // Силуэт домика
      cityCtx.fillStyle = "rgba(8, 14, 28, 0.95)";
      cityCtx.fillRect(house.x, house.y, house.w, house.h);

      // Крыша
      cityCtx.beginPath();
      cityCtx.moveTo(house.x - 3, house.y);
      cityCtx.lineTo(house.x + house.w / 2, house.y - 10);
      cityCtx.lineTo(house.x + house.w + 3, house.y);
      cityCtx.closePath();
      cityCtx.fillStyle = "rgba(8, 14, 28, 0.95)";
      cityCtx.fill();

      // Окна
      house.windows.forEach(win => {
        const flicker = Math.sin(time * win.flicker + win.phase) * 0.3 + 0.7;
        const alpha = win.on ? 0.8 * flicker : 0.15;

        cityCtx.fillStyle = win.on
          ? `rgba(255, 210, 130, ${alpha})`
          : `rgba(40, 50, 70, ${alpha})`;

        cityCtx.fillRect(
          house.x + win.x,
          house.y + win.y,
          6,
          10
        );
      });
    });
  }

  // --- САКУРА ---
  const sakuraCanvas = document.createElement("canvas");
  sakuraCanvas.id = "sakura-canvas";
  document.body.prepend(sakuraCanvas);

  const sakuraCtx = sakuraCanvas.getContext("2d");
  let petals = [];

  function initSakura() {
    sakuraCanvas.width = window.innerWidth;
    sakuraCanvas.height = window.innerHeight;

    petals = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      petals.push(createPetal(true));
    }
  }

  function createPetal(randomY = false) {
    return {
      x: Math.random() * sakuraCanvas.width,
      y: randomY ? Math.random() * sakuraCanvas.height : -20,
      size: Math.random() * 6 + 4,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.random() * 0.5 - 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: Math.random() * 0.02 - 0.01,
      opacity: Math.random() * 0.5 + 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01
    };
  }

  function drawSakura() {
    sakuraCtx.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height);

    petals.forEach((p, i) => {
      p.y += p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      p.rotation += p.rotSpeed;

      if (p.y > sakuraCanvas.height + 20) {
        petals[i] = createPetal();
      }

      sakuraCtx.save();
      sakuraCtx.translate(p.x, p.y);
      sakuraCtx.rotate(p.rotation);
      sakuraCtx.globalAlpha = p.opacity;

      sakuraCtx.fillStyle = "#ffb7d5";
      sakuraCtx.beginPath();
      sakuraCtx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      sakuraCtx.fill();

      sakuraCtx.restore();
    });
  }

  // --- ТУМАН (CSS) ---
  function createFog() {
    const fog = document.createElement("div");
    fog.className = "fog-bg";
    document.body.prepend(fog);
  }

  // --- АНИМАЦИЯ ---
  function animate(time) {
    drawStars(time);
    drawCity(time);
    drawSakura();
    requestAnimationFrame(animate);
  }

  // --- ЗАПУСК ---
  function init() {
    createFog();
    initStars();
    initCity();
    initSakura();
    requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
      initStars();
      initCity();
      initSakura();
    });
  }

  init();

})();