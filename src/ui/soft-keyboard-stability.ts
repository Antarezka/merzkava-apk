const NON_TEXT_INPUT_TYPES = new Set([
  "button", "submit", "reset", "checkbox", "radio", "file", "image", "range", "color"
]);

export function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object" || !("tagName" in target)) return false;
  const element = target as HTMLElement;
  const tag = String(element.tagName).toLowerCase();
  if (tag === "textarea") return true;
  if (tag === "input") {
    const type = String(element.getAttribute("type") || "text").toLowerCase();
    return !NON_TEXT_INPUT_TYPES.has(type);
  }
  return element.isContentEditable === true || element.getAttribute("contenteditable") === "true";
}

/**
 * Keeps short-screen layout breakpoints from treating the Android soft keyboard
 * as a physically short device. The class is purely presentational: it does not
 * rerender the app, pause Anime.js, or alter animation timing/state.
 */
export function installSoftKeyboardStability(
  documentRef: Document = document,
  windowRef: Window = window
): () => void {
  const root = documentRef.documentElement;
  let blurTimer = 0;

  const applyFocusState = (): void => {
    const keyboardExpected = isTextEntryTarget(documentRef.activeElement);
    root.classList.toggle("soft-keyboard-open", keyboardExpected);
  };

  const onFocusIn = (event: FocusEvent): void => {
    if (!isTextEntryTarget(event.target)) return;
    windowRef.clearTimeout(blurTimer);
    root.classList.add("soft-keyboard-open");
  };

  const onFocusOut = (): void => {
    windowRef.clearTimeout(blurTimer);
    // Allow the next field to receive focus before removing the stability class.
    blurTimer = windowRef.setTimeout(applyFocusState, 180);
  };

  documentRef.addEventListener("focusin", onFocusIn, true);
  documentRef.addEventListener("focusout", onFocusOut, true);
  applyFocusState();

  return () => {
    windowRef.clearTimeout(blurTimer);
    documentRef.removeEventListener("focusin", onFocusIn, true);
    documentRef.removeEventListener("focusout", onFocusOut, true);
    root.classList.remove("soft-keyboard-open");
  };
}
