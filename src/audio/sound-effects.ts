type AudioContextConstructor = typeof AudioContext;

let audioContext: AudioContext | null = null;
let soundEnabled = true;
let openingPlayed = false;

function context(): AudioContext | null {
  if (!soundEnabled || typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  const activeContext = audioContext;
  if (activeContext.state === "suspended") void activeContext.resume().catch(() => undefined);
  return activeContext;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  endFrequency = frequency
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.035, duration / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playBell(): void {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime + 0.04;
  const patterns = [
    [880, 1174.66], [784, 1046.5, 1318.5], [988, 1318.5], [698.46, 1046.5, 1396.9]
  ];
  const notes = patterns[Math.floor(Math.random() * patterns.length)];
  notes.forEach((frequency, index) => {
    const start = now + index * (0.13 + Math.random() * 0.035);
    tone(ctx, frequency, start, 1.15 + Math.random() * 0.3, 0.055 / (index * 0.25 + 1), "sine", frequency * 0.997);
    tone(ctx, frequency * 2.01, start, 0.48, 0.009, "sine", frequency * 1.98);
  });
}

function playSoftClick(): void {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime + 0.005;
  const variants = [
    { frequency: 520, end: 390, duration: 0.075 },
    { frequency: 640, end: 470, duration: 0.06 },
    { frequency: 440, end: 350, duration: 0.09 },
    { frequency: 580, end: 430, duration: 0.07 }
  ];
  const sound = variants[Math.floor(Math.random() * variants.length)];
  tone(ctx, sound.frequency, now, sound.duration, 0.035, "triangle", sound.end);
  tone(ctx, sound.frequency * 2.4, now, 0.025, 0.006, "sine", sound.frequency * 1.8);
}

function speakOpening(): void {
  if (!soundEnabled || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const japaneseVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith("ja"));
  const preferred = japaneseVoices.filter(voice => /female|woman|kyoko|mizuki|nanami|haruka|sayaka|google 日本語/i.test(voice.name));
  const pool = preferred.length ? preferred : japaneseVoices;
  const utterance = new SpeechSynthesisUtterance("Merzkava Universe");
  utterance.lang = pool.length ? pool[0].lang : "ja-JP";
  if (pool.length) utterance.voice = pool[Math.floor(Math.random() * pool.length)];
  utterance.rate = 0.86 + Math.random() * 0.09;
  utterance.pitch = 1.04 + Math.random() * 0.16;
  utterance.volume = 0.82;
  synth.cancel();
  synth.speak(utterance);
}

export function playOpeningSequence(): void {
  if (openingPlayed || !soundEnabled) return;
  openingPlayed = true;
  playBell();
  let scheduled = false;
  const startVoice = () => {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(speakOpening, 520 + Math.random() * 220);
  };
  if ("speechSynthesis" in window && window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", startVoice, { once: true });
    window.setTimeout(startVoice, 900);
  } else {
    startVoice();
  }
}

export function playButtonSound(): void {
  playSoftClick();
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}
