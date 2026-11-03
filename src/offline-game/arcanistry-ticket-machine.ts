import { animate } from "animejs";

export const ARCANISTRY_LEVER_PULL_DISTANCE = 43;
export const ARCANISTRY_TICKET_TEAR_DISTANCE = 62;
export const ARCANISTRY_MIN_LOADING_MS = 3000;

export function isArcanistryLeverEngaged(distance: number): boolean {
  return Number.isFinite(distance) && distance >= ARCANISTRY_LEVER_PULL_DISTANCE;
}

export function isArcanistryTicketTorn(distance: number): boolean {
  return Number.isFinite(distance) && distance >= ARCANISTRY_TICKET_TEAR_DISTANCE;
}

type TravelHandler = (sceneId: string) => void | Promise<void>;

export function mountArcanistryTicketMachine(root: HTMLElement, onTravel: TravelHandler): () => void {
  const timers = new Set<number>();
  let activeTicket: { element: HTMLButtonElement; pointerId: number; startX: number; lastX: number; startY: number; distance: number } | null = null;
  let activeLever: { element: HTMLButtonElement; machine: HTMLElement; pointerId: number; startY: number; distance: number } | null = null;
  let disposed = false;

  const later = (callback: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!disposed) callback();
    }, delay);
    timers.add(id);
    return id;
  };

  const shake = (machine: HTMLElement, strength: number): void => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    animate(machine, {
      keyframes: [
        { translateX: -strength, rotate: -strength * .12 },
        { translateX: strength * .82, rotate: strength * .096 },
        { translateX: -strength * .58, rotate: -strength * .066 },
        { translateX: strength * .32, rotate: strength * .036 },
        { translateX: 0, rotate: 0 }
      ],
      duration: strength > 5 ? 680 : 430,
      ease: "inOutSine"
    });
  };

  const status = (machine: HTMLElement, message: string): void => {
    const node = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
    if (node) node.textContent = message;
  };

  const updateLever = (machine: HTMLElement): void => {
    const lever = machine.querySelector<HTMLButtonElement>("[data-arcanistry-lever]");
    const available = machine.dataset.selectedAvailable === "true" && Boolean(machine.dataset.selectedScene);
    if (lever) {
      lever.disabled = !available || ["printing", "ticket-ready", "traveling", "inserting-card", "ejecting-card"].includes(machine.dataset.machineState ?? "");
      lever.setAttribute("aria-label", available ? "Pull the quadrant lever downward" : "Select an available destination first");
    }
  };

  const resetTicket = (machine: HTMLElement): void => {
    const ticket = machine.querySelector<HTMLButtonElement>("[data-arcanistry-ticket]");
    if (ticket) {
      ticket.hidden = true;
      ticket.disabled = false;
      ticket.classList.remove("is-returning", "is-torn", "is-under-tension");
      ticket.style.removeProperty("--ticket-pull");
      ticket.style.removeProperty("--tear-bias");
      ticket.style.removeProperty("clip-path");
    }
    machine.classList.remove("has-ticket", "is-printing", "is-running", "is-traveling");
  };

  const selectDestination = (machine: HTMLElement): void => {
    if (["printing", "ticket-ready", "traveling", "inserting-card", "ejecting-card"].includes(machine.dataset.machineState ?? "")) return;
    const cardInserted = machine.dataset.cardInserted === "true";
    machine.dataset.machineState = cardInserted ? "card-inserted" : "idle";
    machine.classList.remove("is-card-required");
    machine.querySelector<HTMLElement>("[data-card-warning-lamp]")?.classList.remove("is-lit");
    updateLever(machine);
    if (machine.dataset.selectedAvailable !== "true") {
      status(machine, "ROUTE UNAVAILABLE · SELECT A REGISTERED DESTINATION");
    } else {
      status(machine, cardInserted ? "DESTINATION SET · PULL QUADRANT LEVER" : "DESTINATION SET · TRAVEL CARD REQUIRED");
    }
  };

  const requireCard = (machine: HTMLElement, lever: HTMLButtonElement): void => {
    machine.dataset.machineState = "card-required";
    machine.classList.add("is-card-required");
    machine.querySelector<HTMLElement>("[data-card-warning-lamp]")?.classList.add("is-lit");
    status(machine, "CARD REQUIRED · INSERT TRAVEL CARD INTO THE SLOT");
    shake(machine, 5.2);
    later(() => shake(machine, 3.1), 230);
    lever.classList.add("is-returning");
    later(() => {
      lever.style.removeProperty("--lever-angle");
      lever.style.removeProperty("--lever-pull");
      lever.classList.remove("is-returning", "is-pulling");
      machine.dataset.machineState = "idle";
      updateLever(machine);
    }, 420);
  };

  const insertCard = (machine: HTMLElement): void => {
    if (machine.dataset.cardInserted === "true" || ["printing", "ticket-ready", "traveling", "inserting-card"].includes(machine.dataset.machineState ?? "")) return;
    const card = machine.querySelector<HTMLButtonElement>("[data-arcanistry-card-insert]");
    if (!card) return;
    machine.dataset.machineState = "inserting-card";
    card.disabled = true;
    card.classList.add("is-swallowing");
    status(machine, "TRAVEL CARD · READING ARCANE SEAL");
    later(() => {
      card.hidden = true;
      card.classList.remove("is-swallowing");
      card.disabled = false;
      machine.dataset.cardInserted = "true";
      machine.dataset.machineState = machine.dataset.selectedAvailable === "true" ? "card-inserted" : "idle";
      machine.classList.remove("is-card-required");
      machine.querySelector<HTMLElement>("[data-card-warning-lamp]")?.classList.remove("is-lit");
      const indicator = machine.querySelector<HTMLElement>("[data-card-inserted-indicator]");
      if (indicator) indicator.hidden = false;
      updateLever(machine);
      status(machine, machine.dataset.selectedAvailable === "true"
        ? "CARD ACCEPTED · PULL QUADRANT LEVER TO PRINT"
        : "CARD ACCEPTED · SELECT AN AVAILABLE DESTINATION");
    }, 680);
  };

  const startIssuance = (machine: HTMLElement, lever: HTMLButtonElement): void => {
    if (machine.dataset.machineState === "printing" || machine.dataset.machineState === "ticket-ready" || machine.dataset.machineState === "traveling") return;
    if (machine.dataset.cardInserted !== "true") {
      requireCard(machine, lever);
      return;
    }
    if (machine.dataset.selectedAvailable !== "true" || !machine.dataset.selectedScene) {
      status(machine, "NO VALID ROUTE · SELECT AN AVAILABLE DESTINATION");
      shake(machine, 2.8);
      return;
    }

    const ticket = machine.querySelector<HTMLButtonElement>("[data-arcanistry-ticket]");
    const card = machine.querySelector<HTMLButtonElement>("[data-arcanistry-card-insert]");
    if (!ticket) return;
    machine.dataset.machineState = "printing";
    machine.style.setProperty("--lamp-flicker-duration", (0.38 + Math.random() * .74).toFixed(2) + "s");
    machine.classList.add("is-running");
    machine.classList.remove("is-card-required", "has-ticket", "is-traveling");
    lever.disabled = true;
    lever.classList.remove("is-pulling", "is-returning");
    lever.classList.add("is-pulled");
    status(machine, "TRANSMISSION ENGAGED · PRINTING DESTINATION TICKET");
    shake(machine, 3.2);
    later(() => shake(machine, 6.5), 280);
    later(() => shake(machine, 2.8), 760);

    later(() => {
      machine.classList.add("is-printing");
      shake(machine, 4.4);
      ticket.hidden = false;
      ticket.classList.remove("is-returning", "is-torn");
      ticket.style.removeProperty("--ticket-pull");
      ticket.style.removeProperty("clip-path");
      const destination = ticket.querySelector<HTMLElement>("[data-ticket-destination]");
      if (destination) destination.textContent = machine.dataset.selectedName ?? "Selected Destination";
      status(machine, "TICKET ISSUED · PULL DOWN TO TEAR");
      machine.dataset.machineState = "ticket-ready";
      machine.classList.add("has-ticket");
      machine.classList.remove("is-running");
      lever.classList.remove("is-pulled");
      lever.classList.add("is-returning");
      lever.style.removeProperty("--lever-angle");
      lever.style.removeProperty("--lever-pull");
      lever.disabled = true;
      later(() => lever.classList.remove("is-returning"), 620);
      if (card) card.disabled = true;
    }, 1480);
  };

  const tearTicket = (ticket: HTMLButtonElement, distance: number, bias: number): void => {
    const machine = ticket.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!machine || machine.dataset.machineState !== "ticket-ready" || !isArcanistryTicketTorn(distance)) return;
    const sceneId = machine.dataset.selectedScene ?? "";
    const loading = machine.querySelector<HTMLElement>("[data-arcanistry-loading]");
    if (!sceneId || !loading) return;

    machine.dataset.machineState = "ejecting-card";
    machine.classList.remove("has-ticket", "is-printing");
    machine.classList.add("is-traveling");
    ticket.dataset.tearDirection = bias < -.12 ? "left-to-right" : bias > .12 ? "right-to-left" : "center";
    ticket.style.setProperty("--tear-bias", String(bias));
    const curve = Math.round(bias * 9);
    const stub = ticket.cloneNode(true) as HTMLButtonElement;
    stub.className = "arcanist-ticket-stub";
    stub.removeAttribute("data-arcanistry-ticket");
    stub.removeAttribute("aria-label");
    stub.setAttribute("aria-hidden", "true");
    stub.disabled = true;
    stub.hidden = false;
    stub.style.removeProperty("--ticket-pull");
    stub.style.removeProperty("clip-path");
    ticket.parentElement?.appendChild(stub);
    ticket.style.clipPath = "polygon(0 " + Math.max(36,45-curve) + "%,16% " + Math.max(33,42-curve*.7) + "%,34% " + Math.min(55,47+curve*.35) + "%,52% " + Math.max(35,43-curve*.25) + "%,72% " + Math.min(56,48+curve*.4) + "%,88% " + Math.max(36,44-curve*.45) + "%,100% " + Math.min(55,47+curve) + "%,100% 100%,0 100%)";
    stub.style.clipPath = "polygon(0 0,100% 0,100% 47%,88% 44%,72% 48%,52% 43%,34% 47%,16% 42%,0 45%)";
    ticket.classList.add("is-torn");
    ticket.disabled = true;
    status(machine, "TICKET TORN · TRAVEL CARD EJECTING");
    shake(machine, 7.4);
    later(() => shake(machine, 3.2), 190);

    later(() => {
      ticket.hidden = true;
      machine.querySelector<HTMLElement>(".arcanist-ticket-stub")?.remove();
      const card = machine.querySelector<HTMLButtonElement>("[data-arcanistry-card-insert]");
      if (card) {
        card.hidden = false;
        card.disabled = true;
        card.classList.add("is-ejecting");
      }
      const indicator = machine.querySelector<HTMLElement>("[data-card-inserted-indicator]");
      if (indicator) indicator.hidden = true;
      later(() => {
        if (card) {
          card.classList.remove("is-ejecting");
          card.disabled = false;
        }
        machine.dataset.cardInserted = "false";
        machine.dataset.machineState = "traveling";
        loading.hidden = false;
        status(machine, "CARD RETURNED · SYNCHRONIZING DESTINATION");
        const started = Date.now();
        later(async () => {
          try {
            await onTravel(sceneId);
          } catch {
            loading.hidden = true;
            machine.dataset.machineState = "idle";
            resetTicket(machine);
            status(machine, "ROUTE INTERRUPTED · PLEASE TRY AGAIN");
            updateLever(machine);
          }
        }, Math.max(0, ARCANISTRY_MIN_LOADING_MS - (Date.now() - started)));
      }, 520);
    }, 360);
  };

  const onDestinationSelected = (event: Event): void => {
    const machine = event.target;
    if (machine instanceof HTMLElement && machine.matches("[data-arcanistry-machine]")) selectDestination(machine);
  };

  const onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const machine = target.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!machine) return;
    const insert = target.closest<HTMLButtonElement>("[data-arcanistry-card-insert]");
    if (insert) {
      insertCard(machine);
      return;
    }
    const lever = target.closest<HTMLButtonElement>("[data-arcanistry-lever]");
    if (lever && event.detail === 0 && !lever.disabled) {
      startIssuance(machine, lever);
      return;
    }
    const ticket = target.closest<HTMLButtonElement>("[data-arcanistry-ticket]");
    if (ticket && event.detail === 0 && machine.dataset.machineState === "ticket-ready") {
      tearTicket(ticket, ARCANISTRY_TICKET_TEAR_DISTANCE, 0);
    }
  };

  const onPointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (!(target instanceof Element) || (event.pointerType === "mouse" && event.button !== 0)) return;
    const lever = target.closest<HTMLButtonElement>("[data-arcanistry-lever]");
    const leverMachine = lever?.closest<HTMLElement>("[data-arcanistry-machine]");
    if (lever && leverMachine && !lever.disabled && leverMachine.dataset.selectedAvailable === "true") {
      activeLever = { element: lever, machine: leverMachine, pointerId: event.pointerId, startY: event.clientY, distance: 0 };
      try { lever.setPointerCapture(event.pointerId); } catch { /* WebView fallback */ }
      event.preventDefault();
      return;
    }
    const ticket = target.closest<HTMLButtonElement>("[data-arcanistry-ticket]");
    const machine = ticket?.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!ticket || !machine || ticket.hidden || machine.dataset.machineState !== "ticket-ready") return;
    activeTicket = { element: ticket, pointerId: event.pointerId, startX: event.clientX, lastX: event.clientX, startY: event.clientY, distance: 0 };
    try { ticket.setPointerCapture(event.pointerId); } catch { /* WebView fallback */ }
    event.preventDefault();
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (activeLever && activeLever.pointerId === event.pointerId) {
      const distance = Math.max(0, Math.min(56, event.clientY - activeLever.startY));
      activeLever.distance = distance;
      const progress = distance / 56;
      const curvedAngle = Math.pow(progress, .9) * -55;
      activeLever.element.style.setProperty("--lever-angle", curvedAngle.toFixed(1) + "deg");
      activeLever.element.classList.toggle("is-pulling", distance > 2);
      event.preventDefault();
      return;
    }
    if (!activeTicket || activeTicket.pointerId !== event.pointerId) return;
    const distance = Math.max(0, Math.min(112, event.clientY - activeTicket.startY));
    activeTicket.distance = distance;
    activeTicket.lastX = event.clientX;
    activeTicket.element.style.setProperty("--ticket-pull", distance + "px");
    activeTicket.element.classList.toggle("is-under-tension", distance >= ARCANISTRY_TICKET_TEAR_DISTANCE * .72);
    event.preventDefault();
  };

  const onPointerEnd = (event: PointerEvent, cancelled = false): void => {
    if (activeLever && activeLever.pointerId === event.pointerId) {
      const active = activeLever;
      activeLever = null;
      try { if (active.element.hasPointerCapture(event.pointerId)) active.element.releasePointerCapture(event.pointerId); } catch { /* already released */ }
      active.element.classList.remove("is-pulling");
      if (!cancelled && isArcanistryLeverEngaged(active.distance)) {
        active.machine.dispatchEvent(new CustomEvent("arcanistry:lever-lock", { bubbles: true }));
        startIssuance(active.machine, active.element);
      }
      else {
        active.element.classList.add("is-returning");
        later(() => {
          active.element.style.removeProperty("--lever-angle");
          active.element.style.removeProperty("--lever-pull");
          active.element.classList.remove("is-returning");
        }, 360);
      }
      return;
    }
    if (!activeTicket || activeTicket.pointerId !== event.pointerId) return;
    const active = activeTicket;
    activeTicket = null;
    try { if (active.element.hasPointerCapture(event.pointerId)) active.element.releasePointerCapture(event.pointerId); } catch { /* already released */ }
    if (!cancelled && isArcanistryTicketTorn(active.distance)) {
      const rect = active.element.getBoundingClientRect();
      const fingerOffset = active.lastX - (rect.left + rect.width / 2);
      const bias = Math.max(-1, Math.min(1, fingerOffset / (rect.width * .42)));
      tearTicket(active.element, active.distance, bias);
      return;
    }
    active.element.classList.remove("is-under-tension");
    active.element.classList.add("is-returning");
    const machine = active.element.closest<HTMLElement>("[data-arcanistry-machine]");
    if (machine && active.distance > 8) shake(machine, 1.2);
    later(() => {
      active.element.style.removeProperty("--ticket-pull");
      active.element.classList.remove("is-returning");
    }, 440);
  };

  root.addEventListener("arcanistry:destination-selected", onDestinationSelected);
  root.addEventListener("click", onClick);
  root.addEventListener("pointerdown", onPointerDown, { passive: false });
  root.addEventListener("pointermove", onPointerMove, { passive: false });
  const onPointerUp = (event: PointerEvent) => onPointerEnd(event);
  const onPointerCancel = (event: PointerEvent) => onPointerEnd(event, true);
  root.addEventListener("pointerup", onPointerUp, { passive: true });
  root.addEventListener("pointercancel", onPointerCancel, { passive: true });

  return () => {
    disposed = true;
    timers.forEach(id => window.clearTimeout(id));
    timers.clear();
    root.removeEventListener("arcanistry:destination-selected", onDestinationSelected);
    root.removeEventListener("click", onClick);
    root.removeEventListener("pointerdown", onPointerDown);
    root.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerup", onPointerUp);
    root.removeEventListener("pointercancel", onPointerCancel);
  };
}
