type AudioContextConstructor = typeof AudioContext;

let audioContext: AudioContext | null = null;
let soundEnabled = true;
let openingPlayed = false;
let openingAudio: HTMLAudioElement | null = null;
let voiceAudio: HTMLAudioElement | null = null;

// Files bundled from public/audio. Add more entries here to enable random variants.
const openingChimes = [
  "/audio/A_delicate_Japanese__%231-1793404302182.mp3"
];
const openingVoices = [
  "/audio/ElevenLabs_2026-10-30T23_45_26_Kuon%20-%20Cheerful%2C%20Clear%20and%20Steady_pvc_sp100_s35_sb100_v4.mp3"
];

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

function playRandomAsset(paths: string[], volume: number): HTMLAudioElement | null {
  if (!soundEnabled || paths.length === 0) return null;
  const path = paths[Math.floor(Math.random() * paths.length)];
  const audio = new Audio(path);
  audio.preload = "auto";
  audio.volume = volume;
  void audio.play().catch(error => {
    console.warn("Merzkava opening audio could not play:", error);
  });
  return audio;
}

export function playOpeningSequence(): void {
  if (openingPlayed || !soundEnabled) return;
  openingPlayed = true;

  openingAudio = playRandomAsset(openingChimes, 0.62);

  // Let the chime begin first, then welcome the player with the voice.
  window.setTimeout(() => {
    if (!soundEnabled) return;
    voiceAudio = playRandomAsset(openingVoices, 0.88);
  }, 650);
}

export function playButtonSound(): void {
  playSoftClick();
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled) {
    openingAudio?.pause();
    voiceAudio?.pause();
    if (openingAudio) openingAudio.currentTime = 0;
    if (voiceAudio) voiceAudio.currentTime = 0;
    if (audioContext?.state === "running") void audioContext.suspend();
  } else if (audioContext?.state === "suspended") {
    void audioContext.resume().catch(() => undefined);
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}
