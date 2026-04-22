// Generate UI sounds procedurally into public/sounds/*.mp3.
// Run with: bun run sounds:build  (requires ffmpeg on PATH).
//
// Design brief: subtle, professional, pro-app feel (Photoshop / Figma / Arc).
// Each sound is synthesized as raw PCM, written to a temp WAV, then encoded
// to MP3 via ffmpeg. The WAV is deleted afterwards.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "public", "sounds");
const SR = 44100;

// --- WAV writing ---

function writeWav(filename, samples) {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const dataLen = pcm.length * 2;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);       // PCM
  buf.writeUInt16LE(1, 22);       // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataLen, 40);
  Buffer.from(pcm.buffer, pcm.byteOffset, dataLen).copy(buf, 44);
  fs.writeFileSync(filename, buf);
}

// --- Primitives ---

function sine(durSec, f0, f1 = f0, amp = 1) {
  const n = Math.round(SR * durSec);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0;
    const f = f0 * Math.pow(f1 / f0, t); // exponential pitch sweep
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase) * amp;
  }
  return out;
}

function noise(durSec, amp = 1) {
  const n = Math.round(SR * durSec);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = (Math.random() * 2 - 1) * amp;
  return out;
}

// 1-pole RC highpass
function highpass(samples, fc) {
  const rc = 1 / (2 * Math.PI * fc);
  const dt = 1 / SR;
  const alpha = rc / (rc + dt);
  const out = new Float32Array(samples.length);
  let prevX = 0, prevY = 0;
  for (let i = 0; i < samples.length; i++) {
    const y = alpha * (prevY + samples[i] - prevX);
    prevX = samples[i];
    prevY = y;
    out[i] = y;
  }
  return out;
}

// 1-pole RC lowpass
function lowpass(samples, fc) {
  const rc = 1 / (2 * Math.PI * fc);
  const dt = 1 / SR;
  const alpha = dt / (rc + dt);
  const out = new Float32Array(samples.length);
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    prev = prev + alpha * (samples[i] - prev);
    out[i] = prev;
  }
  return out;
}

// Linear attack, exponential decay envelope
function envelope(samples, { attack = 0.002, decayCurve = 5 } = {}) {
  const n = samples.length;
  const attackN = Math.max(1, Math.min(Math.round(attack * SR), n));
  for (let i = 0; i < n; i++) {
    let env;
    if (i < attackN) env = i / attackN;
    else {
      const t = (i - attackN) / Math.max(1, n - attackN);
      env = Math.exp(-t * decayCurve);
    }
    samples[i] *= env;
  }
  return samples;
}

function gain(samples, g) {
  for (let i = 0; i < samples.length; i++) samples[i] *= g;
  return samples;
}

function mix(...tracks) {
  const maxLen = Math.max(...tracks.map((t) => t.length));
  const out = new Float32Array(maxLen);
  for (const t of tracks) {
    for (let i = 0; i < t.length; i++) out[i] += t[i];
  }
  return out;
}

function softClip(samples, threshold = 0.95) {
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const abs = Math.abs(s);
    if (abs > threshold) {
      samples[i] = Math.sign(s) *
        (threshold + (1 - threshold) * Math.tanh((abs - threshold) / (1 - threshold)));
    }
  }
  return samples;
}

// --- Designs ---
//
// Design brief: low-pitch, muted, pro-app feel. Think of a soft wooden
// thump or a deep-desk tap — most energy lives in the 150–900Hz band, no
// bright hiss, no high-sine chirps. Sounds are subtle hints, not events.
//
// Shared language:
//   - bandpassed noise (~200–900Hz) for ticks/thumps
//   - low sine blips (200–500Hz) for commits (navigate, select)
//   - muted low-band whoosh for menu-open

function bandpass(samples, fLo, fHi) {
  return lowpass(highpass(samples, fLo), fHi);
}

// Tool selection (browse/select/draw/text/eraser) — neutral soft low thump
function designTool() {
  let s = noise(0.028, 1);
  s = bandpass(s, 250, 850);
  envelope(s, { attack: 0.0007, decayCurve: 7 });
  return gain(s, 0.55);
}

// Undo — short descending low sine (reversal hint)
function designUndo() {
  const body = sine(0.085, 380, 230, 0.35);
  envelope(body, { attack: 0.003, decayCurve: 4 });
  let tick = noise(0.008, 1);
  tick = bandpass(tick, 300, 900);
  envelope(tick, { attack: 0.0005, decayCurve: 8 });
  gain(tick, 0.3);
  return gain(mix(body, tick), 0.55);
}

// Redo — short ascending low sine (mirror of undo)
function designRedo() {
  const body = sine(0.085, 230, 380, 0.35);
  envelope(body, { attack: 0.003, decayCurve: 4 });
  let tick = noise(0.008, 1);
  tick = bandpass(tick, 300, 900);
  envelope(tick, { attack: 0.0005, decayCurve: 8 });
  gain(tick, 0.3);
  return gain(mix(body, tick), 0.55);
}

// Reset — "snap back to origin": a tiny up-blip that immediately
// resolves downward. Two segments, no continuous glide (so it feels
// decisive, unlike undo's smooth slide). Short and muted.
function designReset() {
  // Segment 1: quick rising blip (the "pull back")
  const pull = sine(0.028, 320, 460, 0.28);
  envelope(pull, { attack: 0.002, decayCurve: 3 });
  // Segment 2: resolution downward (the "drop home")
  const drop = sine(0.09, 440, 220, 0.36);
  envelope(drop, { attack: 0.001, decayCurve: 3.5 });

  // Concatenate with a tiny gap
  const gap = 0.004;
  const total = new Float32Array(
    Math.round(SR * (0.028 + gap + 0.09))
  );
  for (let i = 0; i < pull.length; i++) total[i] = pull[i];
  const offset = pull.length + Math.round(SR * gap);
  for (let i = 0; i < drop.length; i++) total[offset + i] = drop[i];
  return gain(total, 0.6);
}

// Mute — short descending pop, "closing off" feel
function designMute() {
  const body = sine(0.08, 520, 260, 0.3);
  envelope(body, { attack: 0.002, decayCurve: 4 });
  // Tiny noise click at onset to give it articulation
  let tick = noise(0.006, 1);
  tick = bandpass(tick, 350, 900);
  envelope(tick, { attack: 0.0003, decayCurve: 8 });
  gain(tick, 0.2);
  return gain(mix(body, tick), 0.55);
}

// Unmute — short ascending pop, "opening up" feel (mirror of mute)
function designUnmute() {
  const body = sine(0.08, 260, 520, 0.3);
  envelope(body, { attack: 0.002, decayCurve: 4 });
  let tick = noise(0.006, 1);
  tick = bandpass(tick, 350, 900);
  envelope(tick, { attack: 0.0003, decayCurve: 8 });
  gain(tick, 0.2);
  return gain(mix(body, tick), 0.55);
}

// Menu item — quieter low tap
function designMenuItem() {
  let s = noise(0.024, 1);
  s = bandpass(s, 220, 750);
  envelope(s, { attack: 0.0007, decayCurve: 7 });
  return gain(s, 0.5);
}

// Keystroke — low, very quiet muted tick
function designType() {
  let s = noise(0.014, 1);
  s = bandpass(s, 300, 1000);
  envelope(s, { attack: 0.0004, decayCurve: 8 });
  return gain(s, 0.45);
}

// Draw stroke — barely-there low tick; fires every 120ms during strokes
function designDraw() {
  let s = noise(0.01, 1);
  s = bandpass(s, 280, 900);
  envelope(s, { attack: 0.0004, decayCurve: 9 });
  return gain(s, 0.28);
}

// Erase — soft, airy rub. Sits darker than `tool` (which centers around
// 250–850Hz): rolled off to ~400Hz so the energy lives below tool's band.
// Longer and softer-attacked to read as "wiping" rather than a tap.
// Fires every ~120ms while erasing, so gain stays conservative.
function designErase() {
  let s = noise(0.055, 1);
  // Double lowpass at 400Hz — steeper rolloff, darker body.
  s = lowpass(s, 400);
  s = lowpass(s, 400);
  // Gentle highpass at 80Hz keeps it from booming on laptop speakers.
  s = highpass(s, 80);
  // Fast amplitude shimmer for a textured "rub" quality, not a flat hiss.
  for (let i = 0; i < s.length; i++) {
    const t = i / (s.length - 1);
    s[i] *= 0.8 + 0.2 * Math.sin(2 * Math.PI * 32 * t);
  }
  envelope(s, { attack: 0.006, decayCurve: 3 });
  return gain(s, 0.55);
}

// Navigate — low descending sine commit with a muted transient
function designNavigate() {
  const body = sine(0.13, 440, 300, 0.35);
  envelope(body, { attack: 0.005, decayCurve: 3.5 });
  let tick = noise(0.009, 1);
  tick = bandpass(tick, 250, 800);
  envelope(tick, { attack: 0.0005, decayCurve: 7 });
  gain(tick, 0.35);
  return gain(mix(body, tick), 0.6);
}

// Select (canvas pick) — single soft low pluck, short and unobtrusive
function designSelect() {
  const body = sine(0.055, 340, 340, 0.3);
  envelope(body, { attack: 0.003, decayCurve: 5 });
  return gain(body, 0.55);
}

// Text-begin — text tool clicking to start typing.
// A whisper of low noise + a brief mid pluck: "cursor placed, ready to type".
// Deliberately different from `select` (pluck is higher, has a noise head).
function designTextBegin() {
  let head = noise(0.014, 1);
  head = bandpass(head, 400, 1200);
  envelope(head, { attack: 0.0006, decayCurve: 7 });
  gain(head, 0.3);
  const blip = sine(0.07, 520, 520, 0.22);
  envelope(blip, { attack: 0.003, decayCurve: 4 });
  return gain(mix(head, blip), 0.55);
}

// Menu open — muted low whoosh, no bright accent
function designMenuOpen() {
  const whooshDur = 0.16;
  const raw = noise(whooshDur, 1);
  const lpLow = lowpass(raw, 280);
  const lpHigh = lowpass(raw, 700);
  const whoosh = new Float32Array(lpLow.length);
  for (let i = 0; i < whoosh.length; i++) {
    const t = i / (whoosh.length - 1);
    whoosh[i] = lpLow[i] * (1 - t) + lpHigh[i] * t;
  }
  envelope(whoosh, { attack: 0.025, decayCurve: 2.8 });
  gain(whoosh, 0.42);

  const blip = sine(0.11, 280, 380, 0.25);
  envelope(blip, { attack: 0.007, decayCurve: 3.5 });

  return gain(mix(whoosh, blip), 0.55);
}

// --- Run ---

const designs = {
  tool: designTool,
  undo: designUndo,
  redo: designRedo,
  reset: designReset,
  mute: designMute,
  unmute: designUnmute,
  "menu-item": designMenuItem,
  "menu-open": designMenuOpen,
  type: designType,
  draw: designDraw,
  erase: designErase,
  navigate: designNavigate,
  select: designSelect,
  "text-begin": designTextBegin,
};

fs.mkdirSync(OUT, { recursive: true });

for (const [name, fn] of Object.entries(designs)) {
  const samples = softClip(fn());
  const wav = path.join(OUT, `.${name}.wav`);
  const mp3 = path.join(OUT, `${name}.mp3`);
  writeWav(wav, samples);
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-b:a", "96k", mp3]);
  fs.unlinkSync(wav);
  if (r.status !== 0) {
    console.error(`ffmpeg failed for ${name}:`, r.stderr?.toString());
    process.exit(1);
  }
  console.log(`generated ${path.relative(process.cwd(), mp3)}`);
}
