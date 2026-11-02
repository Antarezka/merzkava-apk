let soundEnabled = true;
let openingPlayed = false;
let openingCancelled = false;
let openingAudio: HTMLAudioElement | null = null;
let voiceAudio: HTMLAudioElement | null = null;
let pendingAudioFinish: (() => void) | null = null;
let buttonAudio: HTMLAudioElement | null = null;

const openingChimes = [
  "/audio/A_delicate_Japanese__%231-1793404302182.mp3"
];
const openingVoices = [
  "/audio/ElevenLabs_2026-10-30T23_45_26_Kuon%20-%20Cheerful%2C%20Clear%20and%20Steady_pvc_sp100_s35_sb100_v4.mp3"
];
const buttonSounds = ["/audio/soft-click.mp3"];

function playAudio(path: string, volume: number, allowAfterOpeningCancel = false): Promise<void> {
  if (!soundEnabled || (openingCancelled && !allowAfterOpeningCancel)) return Promise.resolve();
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
  if (!buttonAudio) {
    buttonAudio = new Audio(path);
    buttonAudio.preload = "auto";
  }
  buttonAudio.pause();
  buttonAudio.currentTime = 0;
  buttonAudio.volume = 0.48;
  void buttonAudio.play().catch(error => {
    console.warn("Merzkava tap sound could not play:", error);
  });
}

export function playWarningBeep(): void {
  if (!soundEnabled) return;
  try {
    const context = new window.AudioContext();
    const now = context.currentTime;
    [0, 0.105].forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const volume = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(index === 0 ? 740 : 620, now + offset);
      volume.gain.setValueAtTime(0.0001, now + offset);
      volume.gain.exponentialRampToValueAtTime(0.075, now + offset + 0.012);
      volume.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.075);
      oscillator.connect(volume);
      volume.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.08);
    });
    window.setTimeout(() => { void context.close(); }, 280);
  } catch (error) {
    console.warn("Merzkava warning beep could not play:", error);
  }
}

export function playSnapshotSlideSound(direction: "down" | "up"): void {
  if (!soundEnabled) return;

  // A short, filtered noise sweep gives the snapshot strip a soft paper-on-paper glide.
  try {
    const AudioContextConstructor = window.AudioContext;
    if (AudioContextConstructor) {
      const context = new AudioContextConstructor();
      const duration = direction === "down" ? 0.2 : 0.17;
      const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const fadeIn = Math.min(1, i / (context.sampleRate * 0.018));
        const fadeOut = Math.min(1, (frameCount - i) / (context.sampleRate * 0.055));
        channel[i] = (Math.random() * 2 - 1) * fadeIn * fadeOut;
      }

      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const volume = context.createGain();
      source.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(direction === "down" ? 1250 : 1450, context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(720, context.currentTime + duration);
      filter.Q.value = 0.7;
      volume.gain.setValueAtTime(0.0001, context.currentTime);
      volume.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.035);
      volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      source.connect(filter);
      filter.connect(volume);
      volume.connect(context.destination);
      source.onended = () => { void context.close(); };
      if (context.state === "suspended") void context.resume();
      source.start();
    }
  } catch (error) {
    console.warn("Merzkava snapshot slide sound could not play:", error);
  }

  // Closing upward ends with the existing warm, quiet mechanical tap.
  if (direction === "up") {
    window.setTimeout(() => playButtonSound(), 115);
  }
}


/** A restrained mechanical ratchet tick for each navigation snap. */
export function playNavigationTick(): void {
  if (!soundEnabled) return;
  try {
    const context = new window.AudioContext();
    const now = context.currentTime;
    const bursts = [0, 0.032, 0.064];
    bursts.forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1850 - index * 210, now + offset);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2600 - index * 250, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(index === 2 ? 0.025 : 0.04, now + offset + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.018);
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.02);
    });
    window.setTimeout(() => { void context.close(); }, 180);
  } catch (error) {
    console.warn("Merzkava navigation tick could not play:", error);
  }
}

let lastClockworkRatchetAt = 0;

/** A short, low-volume metal-and-pawl ratchet for the rotary navigation rings. */
export function playClockworkRatchet(): void {
  if (!soundEnabled) return;
  const stamp = performance.now();
  if (stamp - lastClockworkRatchetAt < 42) return;
  lastClockworkRatchetAt = stamp;
  try {
    const context = new window.AudioContext();
    const now = context.currentTime;
    const sampleCount = Math.floor(context.sampleRate * 0.12);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < sampleCount; index += 1) {
      const fade = 1 - index / sampleCount;
      samples[index] = (Math.random() * 2 - 1) * fade * fade;
    }

    const scrape = context.createBufferSource();
    const scrapeFilter = context.createBiquadFilter();
    const scrapeGain = context.createGain();
    scrape.buffer = buffer;
    scrapeFilter.type = "bandpass";
    scrapeFilter.frequency.setValueAtTime(820, now);
    scrapeFilter.Q.setValueAtTime(0.72, now);
    scrapeGain.gain.setValueAtTime(0.0001, now);
    scrapeGain.gain.exponentialRampToValueAtTime(0.025, now + 0.006);
    scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.105);
    scrape.connect(scrapeFilter);
    scrapeFilter.connect(scrapeGain);
    scrapeGain.connect(context.destination);
    scrape.start(now);
    scrape.stop(now + 0.11);

    [0, 0.034, 0.069].forEach((offset, index) => {
      const pawl = context.createOscillator();
      const pawlFilter = context.createBiquadFilter();
      const pawlGain = context.createGain();
      pawl.type = "triangle";
      pawl.frequency.setValueAtTime(310 - index * 42, now + offset);
      pawl.frequency.exponentialRampToValueAtTime(175 - index * 18, now + offset + 0.022);
      pawlFilter.type = "lowpass";
      pawlFilter.frequency.setValueAtTime(1050, now + offset);
      pawlGain.gain.setValueAtTime(0.0001, now + offset);
      pawlGain.gain.exponentialRampToValueAtTime(0.035, now + offset + 0.003);
      pawlGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.028);
      pawl.connect(pawlFilter);
      pawlFilter.connect(pawlGain);
      pawlGain.connect(context.destination);
      pawl.start(now + offset);
      pawl.stop(now + offset + 0.03);
    });
    window.setTimeout(() => { void context.close(); }, 220);
  } catch (error) {
    console.warn("Merzkava clockwork ratchet could not play:", error);
  }
}


/** Original synthesized carriage-return lever: spring scrape, metal detent and a weighty return clack. */
export function playTypewriterLeverSound(): void {
  if (!soundEnabled) return;
  try {
    const context = new window.AudioContext();
    const now = context.currentTime;
    if (context.state === "suspended") void context.resume();

    // Carriage rail: a short, dry metal-on-metal slide that eases to a stop.
    const length = Math.floor(context.sampleRate * 0.22);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const progress = i / length;
      const envelope = Math.min(1, i / (context.sampleRate * 0.006)) * Math.pow(1 - progress, 1.35);
      const grit = (Math.random() * 2 - 1) * 0.72 + Math.sin(i * 0.19) * 0.28;
      samples[i] = grit * envelope;
    }
    const scrape = context.createBufferSource();
    const rail = context.createBiquadFilter();
    const scrapeGain = context.createGain();
    scrape.buffer = buffer;
    rail.type = "bandpass";
    rail.frequency.setValueAtTime(1450, now);
    rail.frequency.exponentialRampToValueAtTime(360, now + 0.19);
    rail.Q.value = 1.15;
    scrapeGain.gain.setValueAtTime(0.0001, now);
    scrapeGain.gain.exponentialRampToValueAtTime(0.075, now + 0.018);
    scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);
    scrape.connect(rail);
    rail.connect(scrapeGain);
    scrapeGain.connect(context.destination);
    scrape.start(now);
    scrape.stop(now + 0.22);

    // The carriage reaches its stop: a bright original bell "ding" with soft harmonics.
    const dingAt = now + 0.155;
    [1320, 1980, 2640].forEach((frequency, index) => {
      const bell = context.createOscillator();
      const bellTone = context.createBiquadFilter();
      const bellGain = context.createGain();
      bell.type = "sine";
      bell.frequency.setValueAtTime(frequency, dingAt);
      bellTone.type = "lowpass";
      bellTone.frequency.setValueAtTime(4200, dingAt);
      const peak = [0.105, 0.036, 0.014][index];
      const decay = [0.62, 0.42, 0.28][index];
      bellGain.gain.setValueAtTime(0.0001, dingAt);
      bellGain.gain.exponentialRampToValueAtTime(peak, dingAt + 0.006);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, dingAt + decay);
      bell.connect(bellTone);
      bellTone.connect(bellGain);
      bellGain.connect(context.destination);
      bell.start(dingAt);
      bell.stop(dingAt + decay + 0.02);
    });

    // A quiet mechanical detent underneath the bell gives the stop a physical edge.
    const detent = context.createOscillator();
    const detentGain = context.createGain();
    detent.type = "triangle";
    detent.frequency.setValueAtTime(245, dingAt);
    detent.frequency.exponentialRampToValueAtTime(112, dingAt + 0.075);
    detentGain.gain.setValueAtTime(0.0001, dingAt);
    detentGain.gain.exponentialRampToValueAtTime(0.045, dingAt + 0.004);
    detentGain.gain.exponentialRampToValueAtTime(0.0001, dingAt + 0.085);
    detent.connect(detentGain);
    detentGain.connect(context.destination);
    detent.start(dingAt);
    detent.stop(dingAt + 0.095);

    window.setTimeout(() => { void context.close(); }, 900);
  } catch (error) {
    console.warn("Merzkava typewriter lever sound could not play:", error);
    playClockworkRatchet();
  }
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
