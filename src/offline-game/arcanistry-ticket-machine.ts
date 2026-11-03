import { animate } from "animejs";

export const ARCANISTRY_TICKET_TEAR_DISTANCE = 62;
export const ARCANISTRY_MIN_LOADING_MS = 3000;

export function isArcanistryTicketTorn(distance: number): boolean {
  return Number.isFinite(distance) && distance >= ARCANISTRY_TICKET_TEAR_DISTANCE;
}

type TravelHandler = (sceneId: string) => void | Promise<void>;

export function mountArcanistryTicketMachine(root: HTMLElement, onTravel: TravelHandler): () => void {
  const timers = new Set<number>();
  let activeTicket: { element: HTMLButtonElement; pointerId: number; startY: number; distance: number } | null = null;
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
    const x = strength;
    const angle = strength * .12;
    animate(machine, {
      keyframes: [
        { translateX: -x, rotate: -angle },
        { translateX: x * .82, rotate: angle * .8 },
        { translateX: -x * .58, rotate: -angle * .55 },
        { translateX: x * .32, rotate: angle * .3 },
        { translateX: 0, rotate: 0 }
      ],
      duration: strength > 5 ? 680 : 430,
      ease: "inOutSine"
    });
  };

  const startIssuance = (machine: HTMLElement, lever: HTMLButtonElement): void => {
    if (machine.dataset.machineState !== "idle" || machine.dataset.selectedAvailable !== "true") return;
    const sceneId = machine.dataset.selectedScene ?? "";
    if (!sceneId) return;

    const status = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
    const ticket = machine.querySelector<HTMLButtonElement>("[data-arcanistry-ticket]");
    const loading = machine.querySelector<HTMLElement>("[data-arcanistry-loading]");
    if (!ticket || !loading) return;

    machine.dataset.machineState = "printing";
    machine.classList.add("is-running");
    machine.classList.remove("has-ticket", "is-traveling");
    lever.disabled = true;
    lever.classList.remove("is-pulling", "is-returning");
    lever.classList.add("is-pulled");
    lever.style.removeProperty("--lever-angle");
    lever.setAttribute("aria-label", "Printing travel ticket");
    if (status) status.textContent = "TRANSMISSION ENGAGED · PRINTING ROUTE TICKET";

    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      animate(lever.querySelector(".arcanist-lever-handle") ?? lever, {
        rotate: [0, 34],
        duration: 240,
        ease: "outCubic"
      });
    }
    shake(machine, 3.2);
    later(() => shake(machine, 6.5), 280);
    later(() => shake(machine, 2.8), 760);

    later(() => {
      machine.classList.add("is-printing");
      shake(machine, 4.4);
      ticket.hidden = false;
      ticket.classList.remove("is-returning", "is-torn");
      ticket.style.removeProperty("--ticket-pull");
      ticket.querySelector("[data-ticket-destination]")!.textContent =
        machine.dataset.selectedName ?? "Selected Destination";
      if (status) status.textContent = "TICKET ISSUED · PULL DOWN TO TEAR";
      machine.dataset.machineState = "ticket-ready";
      machine.classList.add("has-ticket");
      machine.classList.remove("is-running");
      lever.classList.remove("is-pulled");
      lever.disabled = true;
      lever.setAttribute("aria-label", "Ticket issued");
    }, 1480);
  };

  const tearTicket = async (ticket: HTMLButtonElement, distance: number): Promise<void> => {
    const machine = ticket.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!machine || machine.dataset.machineState !== "ticket-ready") return;
    if (!isArcanistryTicketTorn(distance)) return;

    const sceneId = machine.dataset.selectedScene ?? "";
    if (!sceneId) return;
    const status = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
    const loading = machine.querySelector<HTMLElement>("[data-arcanistry-loading]");
    if (!loading) return;

    machine.dataset.machineState = "traveling";
    machine.classList.remove("has-ticket", "is-printing");
    machine.classList.add("is-traveling");
    ticket.classList.add("is-torn");
    ticket.disabled = true;
    if (status) status.textContent = "TICKET ACCEPTED · ROUTE SEALED";
    shake(machine, 7.4);
    later(() => shake(machine, 3.2), 190);

    later(() => {
      ticket.hidden = true;
      loading.hidden = false;
      const loadingStartedAt = Date.now();
      later(async () => {
        if (status) status.textContent = "ARCANISTRY TRANSIT · SYNCHRONIZING";
        try {
          await onTravel(sceneId);
        } catch {
          loading.hidden = true;
          ticket.hidden = true;
          ticket.disabled = false;
          machine.dataset.machineState = "idle";
          machine.classList.remove("is-traveling", "is-running", "is-printing");
          const lever = machine.querySelector<HTMLButtonElement>("[data-arcanistry-lever]");
          if (lever) {
            lever.disabled = machine.dataset.selectedAvailable !== "true";
            lever.setAttribute("aria-label", "Pull lever to issue a travel ticket");
          }
          if (status) status.textContent = "ROUTE INTERRUPTED · PLEASE TRY AGAIN";
        }
      }, Math.max(0, ARCANISTRY_MIN_LOADING_MS - (Date.now() - loadingStartedAt)));
    }, 360);
  };

  const onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const lever = target.closest<HTMLButtonElement>("[data-arcanistry-lever]");
    if (lever) {
      if (event.detail !== 0) return;
      const machine = lever.closest<HTMLElement>("[data-arcanistry-machine]");
      if (machine) startIssuance(machine, lever);
      return;
    }
    const ticket = target.closest<HTMLButtonElement>("[data-arcanistry-ticket]");
    if (ticket && event.detail === 0 && ticket.closest<HTMLElement>("[data-arcanistry-machine]")?.dataset.machineState === "ticket-ready") {
      void tearTicket(ticket, ARCANISTRY_TICKET_TEAR_DISTANCE);
    }
  };

  const onPointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (!(target instanceof Element) || (event.pointerType === "mouse" && event.button !== 0)) return;
    const lever = target.closest<HTMLButtonElement>("[data-arcanistry-lever]");
    const leverMachine = lever?.closest<HTMLElement>("[data-arcanistry-machine]");
    if (lever && leverMachine && !lever.disabled && leverMachine.dataset.machineState === "idle" && leverMachine.dataset.selectedAvailable === "true") {
      activeLever = { element: lever, machine: leverMachine, pointerId: event.pointerId, startY: event.clientY, distance: 0 };
      try { lever.setPointerCapture(event.pointerId); } catch { /* WebView fallback */ }
      event.preventDefault();
      return;
    }
    const ticket = target.closest<HTMLButtonElement>("[data-arcanistry-ticket]");
    const machine = ticket?.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!ticket || !machine || ticket.hidden || machine.dataset.machineState !== "ticket-ready") return;
    activeTicket = { element: ticket, pointerId: event.pointerId, startY: event.clientY, distance: 0 };
    try { ticket.setPointerCapture(event.pointerId); } catch { /* WebView fallback */ }
    event.preventDefault();
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (activeLever && activeLever.pointerId === event.pointerId) {
      const distance = Math.max(0, Math.min(58, event.clientY - activeLever.startY));
      activeLever.distance = distance;
      activeLever.element.style.setProperty("--lever-angle", (distance * .82) + "deg");
      activeLever.element.classList.toggle("is-pulling", distance > 2);
      event.preventDefault();
      return;
    }
    if (!activeTicket || activeTicket.pointerId !== event.pointerId) return;
    const distance = Math.max(0, Math.min(112, event.clientY - activeTicket.startY));
    activeTicket.distance = distance;
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
      if (!cancelled && active.distance >= 43) {
        startIssuance(active.machine, active.element);
      } else {
        active.element.classList.add("is-returning");
        later(() => { active.element.style.removeProperty("--lever-angle"); active.element.classList.remove("is-returning"); }, 360);
      }
      return;
    }
    if (!activeTicket || activeTicket.pointerId !== event.pointerId) return;
    const active = activeTicket;
    activeTicket = null;
    try {
      if (active.element.hasPointerCapture(event.pointerId)) active.element.releasePointerCapture(event.pointerId);
    } catch { /* already released */ }
    const machine = active.element.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!cancelled && isArcanistryTicketTorn(active.distance)) {
      void tearTicket(active.element, active.distance);
      return;
    }
    active.element.classList.remove("is-under-tension");
    active.element.classList.add("is-returning");
    if (machine && active.distance > 8) shake(machine, 1.2);
    later(() => {
      active.element.style.removeProperty("--ticket-pull");
      active.element.classList.remove("is-returning");
    }, 440);
  };

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
    root.removeEventListener("click", onClick);
    root.removeEventListener("pointerdown", onPointerDown);
    root.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerup", onPointerUp);
    root.removeEventListener("pointercancel", onPointerCancel);
  };
}
