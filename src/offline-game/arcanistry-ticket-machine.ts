import { animate } from "animejs";

export const ARCANISTRY_LEVER_PULL_DISTANCE = 43;
export const ARCANISTRY_TICKET_TEAR_DISTANCE = 62;
export const ARCANISTRY_MIN_LOADING_MS = 3000;
export const ARCANISTRY_CODE_LENGTH = 4;

export function isArcanistryLeverEngaged(distance: number): boolean {
  return Number.isFinite(distance) && distance >= ARCANISTRY_LEVER_PULL_DISTANCE;
}

export function isArcanistryTicketTorn(distance: number): boolean {
  return Number.isFinite(distance) && distance >= ARCANISTRY_TICKET_TEAR_DISTANCE;
}

export function createArcanistryCode(random = Math.random): string {
  return String(Math.floor(Math.max(0, Math.min(.999999999, random())) * 10000)).padStart(4, "0");
}

export function isArcanistryCodeCorrect(expected: string, entered: string): boolean {
  return /^\d{4}$/.test(expected) && /^\d{4}$/.test(entered) && expected === entered;
}

type TravelHandler = (sceneId: string) => void | Promise<void>;

export function mountArcanistryTicketMachine(root: HTMLElement, onTravel: TravelHandler): () => void {
  const timers = new Set<number>();
  let activeTicket: { element: HTMLButtonElement; pointerId: number; startX: number; lastX: number; startY: number; distance: number } | null = null;
  let activeLever: { element: HTMLButtonElement; machine: HTMLElement; pointerId: number; startY: number; distance: number } | null = null;
  let dialToken = 0;
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

  const setInputDisplay = (machine: HTMLElement, value: string): void => {
    machine.querySelectorAll<HTMLElement>("[data-code-input-digit]").forEach((digit, index) => {
      digit.textContent = value[index] ?? "—";
      digit.classList.toggle("is-filled", Boolean(value[index]));
    });
    const progress = machine.querySelector<HTMLElement>("[data-code-progress]");
    if (progress) progress.textContent = value.length + " / 4 DIGITS ENTERED";
  };

  const resetAuthentication = (machine: HTMLElement, clearDestination = false): void => {
    dialToken += 1;
    machine.dataset.machineState = "idle";
    machine.dataset.authCode = "";
    machine.dataset.enteredCode = "";
    machine.classList.remove("is-code-verified", "is-code-rejected", "is-code-entering");
    const codeDigits = machine.querySelectorAll<HTMLElement>("[data-code-digit]");
    codeDigits.forEach(digit => {
      digit.textContent = "—";
      digit.classList.remove("is-spinning");
    });
    setInputDisplay(machine, "");
    const dial = machine.querySelector<HTMLElement>("[data-arcanistry-dial-rotor]");
    dial?.style.removeProperty("--dial-turn");
    machine.querySelectorAll<HTMLButtonElement>("[data-dial-digit]").forEach(button => { button.disabled = true; });
    const generate = machine.querySelector<HTMLButtonElement>("[data-generate-code]");
    if (generate) generate.disabled = !((machine.dataset.selectedAvailable === "true") && Boolean(machine.dataset.selectedScene));
    const cancel = machine.querySelector<HTMLButtonElement>("[data-cancel-code]");
    if (cancel) cancel.disabled = !machine.dataset.selectedScene;
    const lever = machine.querySelector<HTMLButtonElement>("[data-arcanistry-lever]");
    if (lever) {
      lever.disabled = true;
      lever.classList.remove("is-pulling", "is-pulled", "is-returning");
      lever.style.removeProperty("--lever-angle");
      lever.style.removeProperty("--lever-pull");
      lever.setAttribute("aria-label", "Lever locked until code verification");
    }
    if (clearDestination) {
      machine.dataset.selectedScene = "";
      machine.dataset.selectedAvailable = "false";
      machine.dataset.selectedName = "";
    }
    const status = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
    if (status) status.textContent = clearDestination ? "SELECT A DESTINATION TO PREPARE THE ROUTE" : "DESTINATION SET · GENERATE ACCESS CODE";
  };

  const generateCode = (machine: HTMLElement): void => {
    if (machine.dataset.machineState !== "idle" || machine.dataset.selectedAvailable !== "true" || !machine.dataset.selectedScene) return;
    const code = createArcanistryCode();
    machine.dataset.authCode = code;
    machine.dataset.enteredCode = "";
    machine.dataset.machineState = "code-ready";
    machine.classList.remove("is-code-verified", "is-code-rejected");
    const generate = machine.querySelector<HTMLButtonElement>("[data-generate-code]");
    if (generate) generate.disabled = true;
    const cancel = machine.querySelector<HTMLButtonElement>("[data-cancel-code]");
    if (cancel) cancel.disabled = false;
    machine.querySelectorAll<HTMLButtonElement>("[data-dial-digit]").forEach(button => { button.disabled = false; });
    machine.querySelectorAll<HTMLElement>("[data-code-digit]").forEach((digit, index) => {
      digit.classList.add("is-spinning");
      digit.textContent = String(Math.floor(Math.random() * 10));
      later(() => {
        digit.textContent = code[index];
        digit.classList.remove("is-spinning");
      }, 420 + index * 170);
    });
    setInputDisplay(machine, "");
    const status = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
    if (status) status.textContent = "ACCESS CODE GENERATED · ENTER FOUR DIGITS";
  };

  const verifyCode = (machine: HTMLElement): void => {
    const entered = machine.dataset.enteredCode ?? "";
    if (entered.length !== ARCANISTRY_CODE_LENGTH) return;
    if (!isArcanistryCodeCorrect(machine.dataset.authCode ?? "", entered)) {
      machine.dataset.machineState = "code-ready";
      machine.dataset.enteredCode = "";
      machine.classList.add("is-code-rejected");
      setInputDisplay(machine, "");
      const status = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
      if (status) status.textContent = "CODE MISMATCH · TRY AGAIN";
      later(() => machine.classList.remove("is-code-rejected"), 650);
      later(() => {
        if (machine.dataset.machineState === "code-ready" && status) status.textContent = "ACCESS CODE RETAINED · RE-ENTER FOUR DIGITS";
      }, 850);
      return;
    }

    machine.dataset.machineState = "verified";
    machine.classList.add("is-code-verified");
    machine.classList.remove("is-code-rejected");
    machine.querySelectorAll<HTMLButtonElement>("[data-dial-digit]").forEach(button => { button.disabled = true; });
    const lever = machine.querySelector<HTMLButtonElement>("[data-arcanistry-lever]");
    if (lever) {
      lever.disabled = false;
      lever.setAttribute("aria-label", "Pull lever downward to issue the travel ticket");
    }
    const status = machine.querySelector<HTMLElement>("[data-arcanistry-status]");
    if (status) status.textContent = "CODE VERIFIED · TRANSMISSION UNLOCKED";
  };

  const enterDialDigit = (machine: HTMLElement, digit: string): void => {
    if (!/^\d$/.test(digit) || (machine.dataset.machineState !== "code-ready" && machine.dataset.machineState !== "entering-code")) return;
    const entered = machine.dataset.enteredCode ?? "";
    if (entered.length >= ARCANISTRY_CODE_LENGTH) return;
    const rotor = machine.querySelector<HTMLElement>("[data-arcanistry-dial-rotor]");
    if (!rotor) return;
    const token = ++dialToken;
    machine.dataset.machineState = "entering-code";
    machine.classList.add("is-code-entering");
    machine.querySelectorAll<HTMLButtonElement>("[data-dial-digit]").forEach(button => { button.disabled = true; });
    rotor.style.setProperty("--dial-turn", (Number(digit) * 36 + 360) + "deg");
    later(() => {
      if (token !== dialToken || disposed) return;
      rotor.style.setProperty("--dial-turn", "0deg");
      machine.dataset.enteredCode = entered + digit;
      setInputDisplay(machine, entered + digit);
      const next = entered + digit;
      machine.dataset.machineState = "code-ready";
      machine.classList.remove("is-code-entering");
      if (next.length === ARCANISTRY_CODE_LENGTH) {
        verifyCode(machine);
      } else {
        machine.querySelectorAll<HTMLButtonElement>("[data-dial-digit]").forEach(button => { button.disabled = false; });
      }
    }, 510);
  };

  const startIssuance = (machine: HTMLElement, lever: HTMLButtonElement): void => {
    if (machine.dataset.machineState !== "verified" || machine.dataset.selectedAvailable !== "true") return;
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
    lever.style.removeProperty("--lever-pull");
    lever.setAttribute("aria-label", "Printing travel ticket");
    if (status) status.textContent = "TRANSMISSION ENGAGED · PRINTING ROUTE TICKET";

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
      lever.classList.add("is-returning");
      lever.style.removeProperty("--lever-angle");
      lever.style.removeProperty("--lever-pull");
      lever.disabled = true;
      lever.setAttribute("aria-label", "Ticket issued");
      later(() => lever.classList.remove("is-returning"), 620);
    }, 1480);
  };

  const tearTicket = async (ticket: HTMLButtonElement, distance: number, tearDirection: "left-to-right" | "right-to-left" | "center" = "center"): Promise<void> => {
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
    ticket.dataset.tearDirection = tearDirection;
    ticket.classList.add("is-torn");
    const dispenser = ticket.closest<HTMLElement>(".arcanist-ticket-dispenser");
    dispenser?.classList.add("has-ticket-stub");
    if (dispenser) dispenser.dataset.tearDirection = tearDirection;
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
          machine.classList.remove("is-traveling", "is-running", "is-printing", "is-code-verified");
          resetAuthentication(machine);
          if (status) status.textContent = "ROUTE INTERRUPTED · PLEASE TRY AGAIN";
        }
      }, Math.max(0, ARCANISTRY_MIN_LOADING_MS - (Date.now() - loadingStartedAt)));
    }, 360);
  };

  const onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const machine = target.closest<HTMLElement>("[data-arcanistry-machine]");
    if (!machine) return;

    const cancel = target.closest<HTMLButtonElement>("[data-cancel-code]");
    if (cancel) {
      resetAuthentication(machine, true);
      machine.querySelectorAll<HTMLElement>("[data-idle-place]").forEach(place => place.classList.remove("is-selected"));
      return;
    }
    const generate = target.closest<HTMLButtonElement>("[data-generate-code]");
    if (generate) {
      generateCode(machine);
      return;
    }
    const dialDigit = target.closest<HTMLButtonElement>("[data-dial-digit]");
    if (dialDigit && !dialDigit.disabled) {
      enterDialDigit(machine, dialDigit.dataset.dialDigit ?? "");
      return;
    }

    const lever = target.closest<HTMLButtonElement>("[data-arcanistry-lever]");
    if (lever) {
      if (event.detail !== 0) return;
      startIssuance(machine, lever);
      return;
    }
    const ticket = target.closest<HTMLButtonElement>("[data-arcanistry-ticket]");
    if (ticket && event.detail === 0 && machine.dataset.machineState === "ticket-ready") {
      void tearTicket(ticket, ARCANISTRY_TICKET_TEAR_DISTANCE, "center");
    }
  };

  const onDestinationSelected = (event: Event): void => {
    const machine = event.target;
    if (machine instanceof HTMLElement && machine.matches("[data-arcanistry-machine]")) resetAuthentication(machine);
  };

  const onPointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (!(target instanceof Element) || (event.pointerType === "mouse" && event.button !== 0)) return;
    const lever = target.closest<HTMLButtonElement>("[data-arcanistry-lever]");
    const leverMachine = lever?.closest<HTMLElement>("[data-arcanistry-machine]");
    if (lever && leverMachine && !lever.disabled && leverMachine.dataset.machineState === "verified" && leverMachine.dataset.selectedAvailable === "true") {
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
      const distance = Math.max(0, Math.min(58, event.clientY - activeLever.startY));
      activeLever.distance = distance;
      activeLever.element.style.setProperty("--lever-angle", (distance * .12) + "deg");
      activeLever.element.style.setProperty("--lever-pull", (distance * .78) + "px");
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
        startIssuance(active.machine, active.element);
      } else {
        active.element.classList.add("is-returning");
        later(() => { active.element.style.removeProperty("--lever-angle"); active.element.style.removeProperty("--lever-pull"); active.element.classList.remove("is-returning"); }, 360);
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
      const rect = active.element.getBoundingClientRect();
      const fingerOffset = active.lastX - (rect.left + rect.width / 2);
      const bias = Math.max(-1, Math.min(1, fingerOffset / (rect.width * .42)));
      const direction = bias < -.12 ? "left-to-right" : bias > .12 ? "right-to-left" : "center";
      void tearTicket(active.element, active.distance, direction);
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
