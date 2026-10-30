import "./style.css";
import { initializeDatabase } from "./database/database";
import { renderScreen, type ScreenId } from "./app/screens";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");

const navigation: { id: ScreenId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "gameplay", label: "Play", icon: "✧" },
  { id: "character", label: "Character", icon: "◉" },
  { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "map", label: "Map", icon: "⌖" },
  { id: "journal", label: "Journal", icon: "☷" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

let activeScreen: ScreenId = "home";
let databaseMessage = "Checking local storage…";

function render(): void {
  app.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button>
        <button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button>
      </header>
      <main class="main-content">${renderScreen(activeScreen)}</main>
      <nav class="bottom-nav" aria-label="Main navigation">
        ${navigation.map(item => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span>${item.icon}</span><small>${item.label}</small></button>`).join("")}
      </nav>
      <div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>
    </div>`;
}

app.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>("[data-screen]");
  const nextScreen = button?.dataset.screen as ScreenId | undefined;
  if (!nextScreen || !navigation.some(item => item.id === nextScreen)) return;
  activeScreen = nextScreen;
  render();
});

render();
void initializeDatabase().then(status => {
  databaseMessage = status.message;
  render();
});
