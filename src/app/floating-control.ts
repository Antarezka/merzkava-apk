import type { FloatingReadiness } from "../native/floating-window";
import { languagePanelMarkup, type AppLanguage } from "../i18n";
import { APP_NAME, APP_VERSION } from "./app-meta";

function status(ready: boolean): string {
  return ready
    ? '<span class="floating-status ready"><i></i>READY</span>'
    : '<span class="floating-status not-ready"><i></i>NOT READY</span>';
}

export function floatingControlMarkup(state: FloatingReadiness, language: AppLanguage = "en"): string {
  return `<main class="floating-control">
    <div class="floating-control-brand"><span class="floating-brand-mark">M</span><div><small>${APP_NAME.toUpperCase()} · APK ${APP_VERSION}</small><h1>Floating Control</h1></div></div>
    ${languagePanelMarkup(language)}\n    <p class="floating-control-intro">Prepare the permissions and background service before entering your world. Complete each step in order.</p>

    <section class="floating-health-panel">
      <div class="floating-health-row"><span>Display over the app</span>${status(state.displayOverApps)}</div>
      <div class="floating-health-row"><span>Notifications</span>${status(state.notifications)}</div>
      <div class="floating-health-row"><span>Battery exemption</span>${status(state.batteryExemption)}</div>
      <div class="floating-health-row"><span>Foreground service</span>${state.serviceRunning ? '<span class="floating-status ready"><i></i>RUNNING</span>' : '<span class="floating-status not-ready"><i></i>NOT RUNNING</span>'}</div>
    </section>

    <section class="floating-setup">
      <div class="floating-section-label">INITIAL SETUP <span>01 — 03</span></div>
      <article class="floating-step ${state.displayOverApps ? "is-ready" : ""}">
        <span class="floating-step-number">01</span><div class="floating-step-copy"><strong>Allowed display over the app</strong><small>Allow Merzkava to appear above other apps.</small></div>
        ${state.displayOverApps ? '<span class="floating-check">✓</span>' : '<button data-floating-action="overlay">Allow ↗</button>'}
      </article>
      <article class="floating-step ${state.notifications ? "is-ready" : ""}">
        <span class="floating-step-number">02</span><div class="floating-step-copy"><strong>Allowed notifications</strong><small>Show the ongoing notification while the service is active.</small></div>
        ${state.notifications ? '<span class="floating-check">✓</span>' : `<button data-floating-action="notifications" ${!state.displayOverApps ? "disabled" : ""}>Allow ↗</button>`}
      </article>
      <article class="floating-step ${state.batteryExemption ? "is-ready" : ""}">
        <span class="floating-step-number">03</span><div class="floating-step-copy"><strong>Allow background activity / battery</strong><small>Reduce the chance that HiOS stops the floating service.</small></div>
        ${state.batteryExemption ? '<span class="floating-check">✓</span>' : `<button data-floating-action="battery" ${!state.notifications ? "disabled" : ""}>Allow ↗</button>`}
      </article>
    </section>

    <section class="floating-actions">
      <div class="floating-section-label">QUICK ACTIONS</div>
      <button class="floating-primary" data-floating-action="start-bubble" ${!(state.displayOverApps && state.notifications && state.batteryExemption) ? "disabled" : ""}>Start bubble mode <span>↗</span></button>
      <button data-floating-action="open-game">Open game / continue playing <span>↗</span></button>
      <button data-floating-action="open-window" ${!state.displayOverApps ? "disabled" : ""}>Open floating mini window <span>↗</span></button>
      <button class="floating-stop" data-floating-action="stop" ${!state.serviceRunning && !state.displayOverApps ? "disabled" : ""}>Stop service and close window <span>×</span></button>
      <button class="floating-donate" data-floating-action="donate">Donate stuff <span>♡</span></button>
    </section>
    <p class="floating-footnote">Foreground service starts automatically when you enter Floating Mode and keeps an ongoing notification visible while the floating session is active.</p>
  </main>`;
}
