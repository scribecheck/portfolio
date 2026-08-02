(function () {
  const body = document.body;
  const toggleBtn = document.querySelector(".toggle-btn");
  const THEME_KEY = "theme";

  // Get system preference
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Apply theme class to body
  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light");
    } else {
      body.classList.remove("light");
    }
  }

  // Get preferred theme (localStorage > system)
  function getPreferredTheme() {
    return localStorage.getItem(THEME_KEY) || getSystemTheme();
  }

  // Set theme and persist
  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialize theme on load
  setTheme(getPreferredTheme());

  // Toggle theme on button click
  toggleBtn.addEventListener("click", () => {
    const isLight = body.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  });
})();


// =============== Language Button ===============
// const japanese = document.getElementById("japanese");
// const english = document.getElementById("english");

// Function to fetch language data
async function fetchLanguageData(lang) {
  const response = await fetch(`assets/json/${lang}.json`);
  return response.json();
}

// Function to set the language preference
function setLanguagePreference(lang) {
  localStorage.setItem("language", lang);
  location.reload();
}

// Function to update content based on selected language
function updateContent(langData) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (element.tagName === "INPUT" && key === "placeholder_text") {
      // If the element is an input with placeholder_text attribute, set placeholder
      element.placeholder = langData[key];
    } else {
      // For other elements, set text content
      //element.textContent = langData[key];
      element.innerHTML = langData[key];
    }
  });
}

// Function to change language
async function changeLanguage(lang) {
  await setLanguagePreference(lang);

  const langData = await fetchLanguageData(lang);
  updateContent(langData);

  //
  toggleJapaneseStylesheet(lang); // Toggle Japanese stylesheet
}

// Function to toggle Japanese stylesheet based on language selection
function toggleJapaneseStylesheet(lang) {
  const head = document.querySelector("head");
  const link = document.querySelector("#styles-link");

  if (link) {
    head.removeChild(link); // Remove the old stylesheet link
  } else if (lang === "ja") {
    const newLink = document.createElement("link");
    newLink.id = "styles-link";
    newLink.rel = "stylesheet";
    newLink.href = "assets/css/styles-ja.css"; // Path to Japanese stylesheet
    head.appendChild(newLink);
    japanese.style.display = 'none';
    english.style.display = 'block';
  }
}


// Call updateContent() on page load
window.addEventListener("DOMContentLoaded", async () => {
  const userPreferredLanguage = localStorage.getItem("language") || "en";
  const langData = await fetchLanguageData(userPreferredLanguage);
  updateContent(langData);
  toggleJapaneseStylesheet(userPreferredLanguage);
});