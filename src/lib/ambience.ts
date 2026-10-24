/* ------------------------------------------------------------------ */
/*  Terrace ambience — a synthesized breeze/city-hum built entirely    */
/*  with the Web Audio API (no audio assets, ~0 KB payload).           */
/*  Brown noise → lowpass → slow gain LFO reads as soft wind and       */
/*  distant street life on the terrace. Default OFF, always started    */
/*  from a user gesture (so autoplay policies are satisfied).          */
/* ------------------------------------------------------------------ */

type Engine = {
  ctx: AudioContext;
  gain: GainNode;
  lfo: OscillatorNode;
};

let engine: Engine | null = null;

/** One-pole brown noise generator into a 4-second loop buffer. */
function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const seconds = 4;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    // Classic brown-noise integrator (leaky to avoid DC drift).
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  // Crossfade the loop seam so the wind never "ticks".
  const fade = Math.floor(ctx.sampleRate * 0.25);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    data[i] = data[i] * t + data[data.length - fade + i] * (1 - t);
  }
  return buffer;
}

function buildEngine(): Engine {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) throw new Error("Web Audio not supported");

  const ctx = new Ctor();
  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx);
  noise.loop = true;

  // Warm, distant tone: cut highs, keep a low murmur.
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 420;
  lowpass.Q.value = 0.4;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  // Slow breathing of the breeze (≈12s cycle, ±40% depth).
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 1 / 12;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.012;
  lfo.connect(lfoDepth).connect(gain.gain);

  noise.connect(lowpass).connect(gain).connect(ctx.destination);

  noise.start();
  lfo.start();
  return { ctx, gain, lfo };
}

/** True once an audio engine exists (i.e. the user started it at some point). */
export function isAmbienceStarted(): boolean {
  return engine !== null;
}

/** Start the ambience — call from a click handler (user gesture). */
export async function startAmbience(): Promise<void> {
  try {
    if (!engine) engine = buildEngine();
    await engine.ctx.resume();
    // QA hook — lets automated tests confirm the context is live.
    (window as unknown as { __msAmbience?: AudioContext }).__msAmbience =
      engine.ctx;

    // Some browsers still hold the context suspended until the next
    // real gesture — nudge it on the first interaction that follows.
    if (engine.ctx.state !== "running") {
      const nudge = () => {
        if (!engine) return;
        void engine.ctx.resume();
        window.removeEventListener("pointerdown", nudge);
        window.removeEventListener("keydown", nudge);
      };
      window.addEventListener("pointerdown", nudge, { once: true });
      window.addEventListener("keydown", nudge, { once: true });
    }

    const now = engine.ctx.currentTime;
    engine.gain.gain.cancelScheduledValues(now);
    // Base level 0.03 + LFO wobble fades in smoothly.
    engine.gain.gain.setTargetAtTime(0.03, now, 0.8);
  } catch {
    /* audio unavailable — the toggle simply stays silent */
  }
}

/** Fade out and suspend — cheap, and keeps the context reusable. */
export function stopAmbience(): void {
  if (!engine) return;
  try {
    const now = engine.ctx.currentTime;
    engine.gain.gain.cancelScheduledValues(now);
    engine.gain.gain.setTargetAtTime(0, now, 0.25);
    window.setTimeout(() => {
      if (engine) void engine.ctx.suspend();
    }, 900);
  } catch {
    /* ignore */
  }
}
