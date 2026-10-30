import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root element was not found.");
}

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <div class="mark" aria-hidden="true">M</div>
      <div><p class="eyebrow">MERZKAVA UNIVERSE</p><h1>Merzkava</h1></div>
      <span class="status">PROTOTYPE</span>
    </header>
    <section class="welcome">
      <p class="eyebrow">A WORLD WAITING</p>
      <h2>Your story<br /><em>begins here.</em></h2>
      <p class="intro">A living cultivation world, guided by an AI Game Master and governed by consistent game rules.</p>
      <button class="primary" type="button" disabled>Adventure is being prepared</button>
    </section>
    <section class="features" aria-label="Planned game sections">
      <article><span>01</span><div><h3>Character</h3><p>Your identity and cultivation path</p></div></article>
      <article><span>02</span><div><h3>Inventory</h3><p>Items, equipment, and wallet</p></div></article>
      <article><span>03</span><div><h3>World Map</h3><p>Explore the three great powers</p></div></article>
      <article><span>04</span><div><h3>Journal</h3><p>Events, quests, and memories</p></div></article>
    </section>
    <footer>FOUNDATION BUILD · LOCAL-FIRST DESIGN</footer>
  </main>
`;
