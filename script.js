document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");

  function applyAutoTheme() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth(); // 0 = январь

    const isSummer = month >= 4 && month <= 8; // май–сентябрь
    const eveningStart = isSummer ? 21 : 18;

    if (hour >= eveningStart || hour <= 6) {
      document.body.classList.add("dark");
      toggleBtn.textContent = "☀️";
    } else {
      toggleBtn.textContent = "🌙";
    }
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }

  toggleBtn.addEventListener("click", toggleTheme);
  applyAutoTheme();
});
