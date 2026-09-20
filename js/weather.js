// ============================================================
// ПОГОДА + ВРЕМЯ + ВОСХОД/ЗАКАТ + ВИЗИТЫ
// ============================================================

(function () {

  const el = document.getElementById("weather-widget");
  if (!el) return;

  const DEFAULT_LAT = 57.8194;
  const DEFAULT_LON = 28.3318;

  const FIRST_VISIT_KEY = "anya_first_visit";
  const LAST_VISIT_KEY = "anya_last_visit";

  // --- Время суток ---
  function getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return "утро";
    if (hour >= 12 && hour < 17) return "день";
    if (hour >= 17 && hour < 23) return "вечер";
    return "ночь";
  }

  // --- Погода по коду ---
  function getWeatherInfo(code) {
    if (code === 0) return { icon: "☀️", text: "Ясно", phrase: "Отличная погода для тренировки!" };
    if (code >= 1 && code <= 3) return { icon: "🌤", text: "Малооблачно", phrase: "Хорошая погода для прогулки." };
    if (code === 45 || code === 48) return { icon: "🌫", text: "Туман", phrase: "Осторожно на улице." };
    if (code >= 51 && code <= 67) return { icon: "🌧", text: "Дождь", phrase: "Возьми зонт, если пойдёшь." };
    if (code >= 71 && code <= 77) return { icon: "❄️", text: "Снег", phrase: "Оденься теплее." };
    if (code >= 80 && code <= 82) return { icon: "🌦", text: "Ливень", phrase: "Лучше остаться дома." };
    if (code >= 95) return { icon: "⛈", text: "Гроза", phrase: "Не выходи на улицу." };
    return { icon: "🌡", text: "Погода", phrase: "Хорошего дня!" };
  }

  // --- Дата и время ---
  function formatDate(d) {
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatTime(d) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  // --- Визиты ---
  function getVisitInfo() {
    const now = Date.now();
    let first = localStorage.getItem(FIRST_VISIT_KEY);

    if (!first) {
      first = now;
      localStorage.setItem(FIRST_VISIT_KEY, first.toString());
    }

    const last = localStorage.getItem(LAST_VISIT_KEY);
    localStorage.setItem(LAST_VISIT_KEY, now.toString());

    const firstDate = new Date(parseInt(first, 10));
    let lastText = "";

    if (last) {
      const diff = now - parseInt(last, 10);
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (mins < 1) lastText = "только что";
      else if (mins < 60) lastText = `${mins} мин назад`;
      else if (hours < 24) lastText = `${hours} ч назад`;
      else lastText = `${days} дн назад`;
    }

    return {
      firstDate: formatDate(firstDate),
      lastVisit: lastText
    };
  }

  // --- Город ---
  async function getCity(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=ru`
      );
      const data = await res.json();
      return data.address?.city || data.address?.town || data.address?.village || "";
    } catch (e) {
      return "";
    }
  }

  // --- Показать ---
  function showWeather(temp, code, city, sunrise, sunset) {
    const info = getWeatherInfo(code);
    const now = new Date();
    const timeStr = formatTime(now);
    const dateStr = formatDate(now);
    const timeOfDay = getTimeOfDay(now.getHours());
    const visits = getVisitInfo();

    el.innerHTML = `
      <div class="weather-row">
        <div class="weather-icon">${info.icon}</div>
        <div class="weather-body">
          <div class="weather-temp">${temp}°C <span class="weather-city">· ${city || "Псков"}</span></div>
          <div class="weather-text">${info.text}</div>
          <div class="weather-phrase">${info.phrase}</div>
        </div>
      </div>

      <div class="weather-divider"></div>

      <div class="weather-info">
        <div class="weather-info-item">
          <span class="weather-info-label">🕐 Сейчас</span>
          <span class="weather-info-value">${timeStr} · ${timeOfDay}</span>
        </div>
        <div class="weather-info-item">
          <span class="weather-info-label">📅 Дата</span>
          <span class="weather-info-value">${dateStr}</span>
        </div>
        <div class="weather-info-item">
          <span class="weather-info-label">🌅 Восход</span>
          <span class="weather-info-value">${sunrise}</span>
        </div>
        <div class="weather-info-item">
          <span class="weather-info-label">🌇 Закат</span>
          <span class="weather-info-value">${sunset}</span>
        </div>
        <div class="weather-info-item">
          <span class="weather-info-label">👁 Первый визит</span>
          <span class="weather-info-value">${visits.firstDate}</span>
        </div>
        ${visits.lastVisit ? `
        <div class="weather-info-item">
          <span class="weather-info-label">⏱ Прошлый визит</span>
          <span class="weather-info-value">${visits.lastVisit}</span>
        </div>` : ""}
      </div>

      <div class="weather-attr">© OpenStreetMap contributors</div>
    `;
  }

  function showLoading() {
    el.innerHTML = `
      <div class="weather-row">
        <div class="weather-icon">🌡</div>
        <div class="weather-body">
          <div class="weather-text">Определяем погоду...</div>
        </div>
      </div>
    `;
  }

  function showError() {
    el.innerHTML = `
      <div class="weather-row">
        <div class="weather-icon">🌡</div>
        <div class="weather-body">
          <div class="weather-text">Погода недоступна</div>
        </div>
      </div>
      <div class="weather-attr">© OpenStreetMap contributors</div>
    `;
  }

  // --- Загрузка ---
  async function loadWeather(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;

      const sunriseRaw = data.daily.sunrise[0];
      const sunsetRaw = data.daily.sunset[0];

      const sunrise = sunriseRaw ? sunriseRaw.split("T")[1] : "—";
      const sunset = sunsetRaw ? sunsetRaw.split("T")[1] : "—";

      const city = await getCity(lat, lon);

      showWeather(temp, code, city, sunrise, sunset);
    } catch (e) {
      showError();
    }
  }

  function getLocation() {
    showLoading();

    if (!navigator.geolocation) {
      loadWeather(DEFAULT_LAT, DEFAULT_LON);
      setInterval(() => loadWeather(DEFAULT_LAT, DEFAULT_LON), 3600000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        loadWeather(lat, lon);
        setInterval(() => loadWeather(lat, lon), 3600000);
      },
      () => {
        loadWeather(DEFAULT_LAT, DEFAULT_LON);
        setInterval(() => loadWeather(DEFAULT_LAT, DEFAULT_LON), 3600000);
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  }

  getLocation();

  // Обновляем время каждую минуту
  setInterval(() => {
    const now = new Date();
    const timeEl = el.querySelector(".weather-info-value");
    if (timeEl && timeEl.textContent.includes("·")) {
      const timeOfDay = getTimeOfDay(now.getHours());
      timeEl.textContent = `${formatTime(now)} · ${timeOfDay}`;
    }
  }, 60000);

})();