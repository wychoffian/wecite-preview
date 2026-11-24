(() => {
  const storageKey = "wecite-theme";
  const root = document.documentElement;
  let preference = "system";

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") preference = saved;
  } catch {
    // The selector still works for this page when browser storage is unavailable.
  }

  function applyTheme(value) {
    if (value === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = value;
    }
  }

  applyTheme(preference);

  document.addEventListener("DOMContentLoaded", () => {
    const selector = document.querySelector(".theme-select");
    selector.value = preference;
    selector.hidden = false;
    selector.addEventListener("change", () => {
      applyTheme(selector.value);
      try {
        if (selector.value === "system") {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, selector.value);
        }
      } catch {
        // The page theme can still change without persisting the preference.
      }
    });
  });
})();
