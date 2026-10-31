type AudioContextConstructor = typeof AudioContext;

let soundEnabled = true;
let openingPlayed = false;
let openingCancelled = false;
let openingAudio: HTMLAudioElement | null = null;
let voiceAudio: HTMLAudioElement | null = null;
let pendingAudioFinish: (() => void) | null = null;

const openingChimes = [
  "/audio/A_delicate_Japanese__%231-1793404302182.mp3"
];
const openingVoices = [
  "/audio/ElevenLabs_2026-10-30T23_45_26_Kuon%20-%20Cheerful%2C%20Clear%20and%20Steady_pvc_sp100_s35_sb100_v4.mp3"
];
const buttonSounds = ["/audio/soft-click.mp3"];

function playAudio(path: string, volume: number): Promise<void> {
  if (!soundEnabled || openingCancelled) return Promise.resolve();
  return new Promise(resolve => {
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.volume = volume;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      audio.onended = null;
      audio.onerror = null;
      if (pendingAudioFinish === finish) pendingAudioFinish = null;
      resolve();
    };
    pendingAudioFinish = finish;
    audio.onended = finish;
    audio.onerror = finish;
    void audio.play().catch(error => {
      console.warn("Merzkava audio could not play:", error);
      finish();
    });
    if (path.includes("A_delicate_Japanese")) openingAudio = audio;
    else if (path.includes("ElevenLabs_")) voiceAudio = audio;
  });
}

function playRandomAsset(paths: string[], volume: number): Promise<void> {
  if (!paths.length) return Promise.resolve();
  const path = paths[Math.floor(Math.random() * paths.length)];
  return playAudio(path, volume);
}

export async function playOpeningSequence(): Promise<void> {
  if (openingPlayed || !soundEnabled) return;
  openingPlayed = true;
  openingCancelled = false;

  await playRandomAsset(openingChimes, 0.62);
  if (openingCancelled || !soundEnabled) return;

  await playRandomAsset(openingVoices, 0.88);
}

export function cancelOpeningSequence(): void {
  openingCancelled = true;
  openingAudio?.pause();
  voiceAudio?.pause();
  if (openingAudio) openingAudio.currentTime = 0;
  if (voiceAudio) voiceAudio.currentTime = 0;
  pendingAudioFinish?.();
  pendingAudioFinish = null;
}

export function playButtonSound(): void {
  if (!soundEnabled) return;
  const path = buttonSounds[Math.floor(Math.random() * buttonSounds.length)];
  void playAudio(path, 0.48);
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled) {
    cancelOpeningSequence();
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}
