const API_BASE = "/api/theme";

document.addEventListener("DOMContentLoaded", () => {
  // Make sure elements exist
  if (
    !document.getElementById("activeThemeTitle") ||
    !document.getElementById("activeThemeSubtitle") ||
    !document.getElementById("activeThemeImage") ||
    !document.getElementById("themesGrid")
  ) return;

  loadThemes();
});

async function loadThemes() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("API error");

    const { data } = await res.json();
    console.log(data, "Here is the data from API");

    const activeTheme = data.find(t => t.isActive);
    renderActiveTheme(activeTheme);
    renderAllThemes(data);

  } catch (err) {
    console.error("Failed to load themes", err);
  }
}

function renderActiveTheme(theme) {
  if (!theme) return;

  const titleEl = document.getElementById("activeThemeTitle");
  const subtitleEl = document.getElementById("activeThemeSubtitle");
  const imageEl = document.getElementById("activeThemeImage");

  if (titleEl) titleEl.innerText = `#${theme._id.slice(-3)} ${theme.themeName}`;
  if (subtitleEl) subtitleEl.innerText = theme.themeName;
  if (imageEl) imageEl.src = theme.imageUrl;
}

function renderAllThemes(themes) {
  const grid = document.getElementById("themesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  themes.forEach(theme => {
    const isSelected = theme.isActive;

    const div = document.createElement("div");
    div.className = "col-xl-3 col-sm-6 grid-margin stretch-card";

    div.innerHTML = `
      <div class="card theme-card">
        <div class="card-body p-0">
          <div class="theme-image-wrapper">
            <img src="${theme.imageUrl}" 
                 alt="${theme.themeName}" 
                 class="theme-image">
            <div class="theme-title-overlay">
              <h3 class="mb-0">${theme.themeName}</h3>
            </div>
          </div>
          <div class="p-3">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="text-muted font-weight-normal mb-0">
                ${theme.themeName}
              </h6>
              <button 
                class="btn btn-${isSelected ? "success" : "primary"} 
                       btn-rounded btn-fw btn-sm selective-button"
                ${isSelected ? "disabled" : ""}
              >
                ${isSelected ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const btn = div.querySelector("button");
    if (!isSelected) {
      btn.addEventListener("click", () => selectTheme(theme._id));
    }

    grid.appendChild(div);
  });
}

async function selectTheme(themeId) {
  try {
    const res = await fetch(`${API_BASE}/activate/${themeId}`, {
      method: "PUT"
    });
    if (!res.ok) throw new Error("Failed to activate");

    loadThemes(); // refresh UI after activation
  } catch (err) {
    console.error("Failed to activate theme", err);
  }
}
