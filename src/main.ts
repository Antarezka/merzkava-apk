import "./style.css";
import { initializeDatabase } from "./database/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./characters/character-repository";
import { validateCharacterDraft } from "./engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");

const navigation: { id: ScreenId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" }, { id: "gameplay", label: "Play", icon: "✧" },
  { id: "character", label: "Character", icon: "◉" }, { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "map", label: "Map", icon: "⌖" }, { id: "journal", label: "Journal", icon: "☷" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

let activeScreen: ScreenId = "home";
let databaseMessage = "Checking local storage…";
let characters: Character[] = [];
let notice = "";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function render(): void {
  app.innerHTML = `<div class="app-shell">
    <header class="app-header"><button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button><button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button></header>
    <main class="main-content">${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}${renderScreen(activeScreen, characters)}</main>
    <nav class="bottom-nav" aria-label="Main navigation">${navigation.map(item => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span>${item.icon}</span><small>${item.label}</small></button>`).join("")}</nav>
    <div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>
  </div>`;
}

async function refreshCharacters(): Promise<void> {
  try { characters = await listCharacters(); }
  catch (error) { notice = error instanceof Error ? error.message : "Could not load characters."; }
}

app.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const deleteButton = target.closest<HTMLButtonElement>("[data-delete-character]");
  if (deleteButton?.dataset.deleteCharacter) {
    try {
      await deleteCharacter(deleteButton.dataset.deleteCharacter);
      await refreshCharacters();
      notice = "Character deleted.";
      render();
    } catch (error) { notice = error instanceof Error ? error.message : "Could not delete character."; render(); }
    return;
  }
  const button = target.closest<HTMLButtonElement>("[data-screen]");
  const nextScreen = button?.dataset.screen as ScreenId | undefined;
  if (!nextScreen || !navigation.some(item => item.id === nextScreen)) return;
  activeScreen = nextScreen;
  notice = "";
  render();
});

app.addEventListener("submit", async (event: SubmitEvent) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "character-form") return;
  event.preventDefault();
  const data = new FormData(form);
  const draft = {
    name: String(data.get("name") ?? ""),
    age: Number(data.get("age")),
    origin: String(data.get("origin") ?? ""),
    background: String(data.get("background") ?? "")
  };
  const validation = validateCharacterDraft(draft);
  const errorNode = form.querySelector<HTMLElement>("#character-error");
  if (!validation.valid) {
    if (errorNode) errorNode.textContent = validation.errors.join(" ");
    return;
  }
  try {
    await createCharacter(validation.value);
    await refreshCharacters();
    notice = "Character created and saved on this device.";
    render();
  } catch (error) {
    if (errorNode) errorNode.textContent = error instanceof Error ? error.message : "Could not save character.";
  }
});

render();
void initializeDatabase().then(async status => {
  databaseMessage = status.message;
  await refreshCharacters();
  render();
});
