"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

/* ═══════════════════════════════════════════════════════════════
   LabsBackground — the drifting nebula field behind every page.

   Reference: labs.lusion.co. A near-black stage with a very slow,
   smoky cloud drifting across it and a fine dust of star-like
   particles that gently twinkle.

   Implementation notes
   ────────────────────
   • All colour is read from the CSS custom properties in
     globals.css (--ink / --dim / --nebula-opacity), so the canvas
     re-tints itself for the light theme with zero hardcoded values.
   • Blobs and particles are drawn from pre-rendered gradient
     sprites via drawImage — no createRadialGradient, no string
     building, no object literals inside the animation loop.
   • prefers-reduced-motion paints exactly one static frame.
   ═══════════════════════════════════════════════════════════════ */

/* ── tuning ──────────────────────────────────────────────────── */
const BLOB_COUNT = 4;
const PARTICLE_COUNT = 300; // dense enough to read as powder, not stars
const BLOB_SPRITE_PX = 512; // sprite resolution for the soft clouds
const PARTICLE_SPRITE_PX = 64; // sprite resolution for the dust
const MAX_DPR = 2; // cap retina cost
const MAX_FRAME_S = 0.05; // clamp dt after a tab-switch stall

/* ── pointer interaction ─────────────────────────────────────────
 * The cursor carries its own pool of light through the field: the
 * smoke brightens around it, the clouds parallax against it, and
 * nearby dust is pushed aside. */
const GLOW_RADIUS = 0.12; // fraction of the viewport diagonal
const GLOW_ALPHA = 0.1; // scaled by --nebula-opacity — a hint of light, not a lamp
const GLOW_LERP = 0.085; // pointer follow easing (trails the cursor)
const PARALLAX_MAX = 30; // px — cloud drift against the pointer

/* ── powder disturbance ──────────────────────────────────────────
 * The cursor shoves motes out of the way and they keep travelling,
 * swirl, then drift home — rather than snapping back. Impulse scales
 * with cursor SPEED, so a slow pass barely stirs the powder and a
 * fast sweep throws it. */
const STIR_RADIUS = 170; // px — reach of the cursor
const STIR_FORCE = 900; // radial impulse strength
const STIR_SWIRL = 0.55; // tangential share — gives the wake its curl
const STIR_SPEED_REF = 900; // px/s that counts as a "full strength" sweep
const DAMPING = 1.9; // how fast disturbance bleeds off (per second)
const RETURN_SPRING = 1.7; // pull back toward the home position
const MAX_OFFSET = 190; // px — clamp so nothing is flung off screen

type RGB = [number, number, number];

/** One slow-moving smoke cloud. Position is a sine path around a
 *  normalised anchor so it never accumulates drift error. */
interface Nebula {
  cx: number; // anchor, fraction of width
  cy: number; // anchor, fraction of height
  ax: number; // drift amplitude, fraction of width
  ay: number; // drift amplitude, fraction of height
  fx: number; // angular frequency, rad/s
  fy: number;
  phx: number; // phase offset
  phy: number;
  radius: number; // fraction of the viewport diagonal
  alpha: number;
  sprite: number; // index into the sprite table
}

/** One mote of powder.
 *
 *  `hx/hy` is where the mote wants to be — it drifts on the ambient current.
 *  `x/y` is where it actually is. The cursor injects velocity into `dx/dy`,
 *  which damps out while a weak spring draws the mote home. That separation
 *  is what makes the powder *stay* disturbed after the cursor has gone by,
 *  instead of snapping back the instant it leaves. */
interface Particle {
  hx: number; // home x (ambient drift)
  hy: number;
  x: number; // rendered x
  y: number;
  vx: number; // ambient drift, px/s
  vy: number;
  dx: number; // disturbance velocity, px/s
  dy: number;
  r: number; // px
  a: number; // base alpha
  tf: number; // twinkle frequency
  tp: number; // twinkle phase
  m: number; // mass — heavier motes shove less and settle sooner
}

/* ── helpers (module scope: never re-created per render) ─────── */

/** Small deterministic PRNG so the field looks identical every load. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampChannel(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.round(n);
}

/** Parse a CSS colour token (#rgb, #rrggbb, #rrggbbaa, rgb(), rgba()). */
function parseRgb(input: string, fallback: RGB): RGB {
  const value = input.trim();
  if (!value) return fallback;

  if (value.charAt(0) === "#") {
    let hex = value.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }
    if (hex.length >= 6) {
      const n = parseInt(hex.slice(0, 6), 16);
      if (!Number.isNaN(n)) {
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      }
    }
    return fallback;
  }

  const parts = value.match(/-?\d*\.?\d+/g);
  if (parts && parts.length >= 3) {
    return [
      clampChannel(parseFloat(parts[0])),
      clampChannel(parseFloat(parts[1])),
      clampChannel(parseFloat(parts[2])),
    ];
  }
  return fallback;
}

/** Pre-render a soft radial falloff into an offscreen canvas. */
function makeSprite(size: number, rgb: RGB, softness: number): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;

  const sctx = sprite.getContext("2d");
  if (!sctx) return sprite;

  const half = size / 2;
  const head = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, `;
  const grad = sctx.createRadialGradient(half, half, 0, half, half, half);

  // A multi-stop falloff reads far smokier than a plain linear ramp.
  grad.addColorStop(0, head + "1)");
  grad.addColorStop(0.18, head + (0.62 * softness).toFixed(4) + ")");
  grad.addColorStop(0.38, head + (0.3 * softness).toFixed(4) + ")");
  grad.addColorStop(0.62, head + (0.1 * softness).toFixed(4) + ")");
  grad.addColorStop(0.82, head + (0.028 * softness).toFixed(4) + ")");
  grad.addColorStop(1, head + "0)");

  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, size, size);
  return sprite;
}

/* ── component ───────────────────────────────────────────────── */

export default function LabsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const root = document.documentElement;
    const styles = getComputedStyle(root);

    /* — palette straight off the design tokens — */
    const isDark = theme === "dark";
    const inkFallback: RGB = isDark ? [255, 255, 255] : [0, 0, 0];
    const dimFallback: RGB = isDark ? [138, 138, 138] : [107, 107, 107];

    const ink = parseRgb(styles.getPropertyValue("--ink"), inkFallback);
    const dim = parseRgb(styles.getPropertyValue("--dim"), dimFallback);

    const nebulaOpacityRaw = parseFloat(styles.getPropertyValue("--nebula-opacity"));
    const nebulaOpacity = Number.isFinite(nebulaOpacityRaw) ? nebulaOpacityRaw : 0.5;

    // Dark: additive build-up gives the glowing smoke. Light: plain
    // source-over so grey clouds simply darken the white ground.
    const composite: GlobalCompositeOperation = isDark ? "lighter" : "source-over";

    /* — sprites (built once per theme) — */
    const blobSprites: HTMLCanvasElement[] = [
      makeSprite(BLOB_SPRITE_PX, ink, 1),
      makeSprite(BLOB_SPRITE_PX, dim, 1),
    ];
    const particleSprite = makeSprite(PARTICLE_SPRITE_PX, ink, 1.35);
    // The cursor's own pool of light, drawn into the same field as the smoke
    // so it genuinely belongs to the background rather than sitting over it.
    const glowSprite = makeSprite(BLOB_SPRITE_PX, ink, 1.15);

    /* — field construction — */
    const rand = mulberry32(1_609_744);

    const blobs: Nebula[] = new Array(BLOB_COUNT);
    for (let i = 0; i < BLOB_COUNT; i++) {
      blobs[i] = {
        cx: 0.16 + rand() * 0.68,
        cy: 0.14 + rand() * 0.72,
        ax: 0.09 + rand() * 0.15,
        ay: 0.07 + rand() * 0.13,
        // 0.012–0.038 rad/s ⇒ a full sweep takes roughly 3–9 minutes.
        fx: 0.012 + rand() * 0.026,
        fy: 0.011 + rand() * 0.024,
        phx: rand() * Math.PI * 2,
        phy: rand() * Math.PI * 2,
        radius: 0.3 + rand() * 0.26,
        alpha: (0.05 + rand() * 0.055) * nebulaOpacity,
        sprite: i % blobSprites.length,
      };
    }

    const particles: Particle[] = new Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 0.4 + rand() * 1.5;
      particles[i] = {
        hx: 0,
        hy: 0,
        x: 0,
        y: 0,
        vx: (rand() - 0.5) * 7,
        vy: -2 - rand() * 6,
        dx: 0,
        dy: 0,
        r: radius,
        a: (0.14 + rand() * 0.5) * nebulaOpacity,
        tf: 0.25 + rand() * 0.85,
        tp: rand() * Math.PI * 2,
        // Bigger motes read as heavier: they move less and settle faster,
        // which keeps the wake from looking like one uniform sheet.
        m: 0.55 + radius * 0.5,
      };
    }

    /* — sizing — */
    let width = 0;
    let height = 0;
    let diagonal = 0;
    let seeded = false;

    /* — pointer state —
       `px/py` is the raw pointer, `gx/gy` the eased light that trails it
       (same lag as the DOM orb, so the two read as one object).
       `glow` fades the whole interaction in and out on enter/leave. */
    let px = -1;
    let py = -1;
    let gx = -1;
    let gy = -1;
    let prevGx = -1; // last frame's eased position — used to measure sweep speed
    let prevGy = -1;
    let glow = 0; // current strength 0..1
    let glowTarget = 0; // where it is heading
    let pointerSeen = false;

    const applySize = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      const prevW = width;
      const prevH = height;

      width = nextW;
      height = nextH;
      diagonal = Math.sqrt(nextW * nextW + nextH * nextH);

      canvas.width = Math.max(1, Math.round(nextW * dpr));
      canvas.height = Math.max(1, Math.round(nextH * dpr));
      canvas.style.width = nextW + "px";
      canvas.style.height = nextH + "px";

      // Resizing the backing store resets state — re-apply both.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = composite;

      if (!seeded) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          p.hx = rand() * nextW;
          p.hy = rand() * nextH;
          p.x = p.hx;
          p.y = p.hy;
        }
        seeded = true;
      } else if (prevW > 0 && prevH > 0) {
        const sx = nextW / prevW;
        const sy = nextH / prevH;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          p.hx *= sx;
          p.hy *= sy;
          p.x *= sx;
          p.y *= sy;
        }
      }
    };

    /* — simulation + paint (allocation-free) — */
    const advance = (dt: number) => {
      // Ease the cursor light toward the real pointer. Frame-rate independent
      // so the trail feels the same on 60Hz and 120Hz displays.
      if (pointerSeen) {
        const k = 1 - Math.pow(1 - GLOW_LERP, dt * 60);
        gx += (px - gx) * k;
        gy += (py - gy) * k;
      }
      glow += (glowTarget - glow) * (1 - Math.pow(1 - 0.06, dt * 60));

      // Cursor speed drives how hard the powder is stirred. Measured on the
      // eased position so a jittery mouse doesn't spike the force.
      const speed = dt > 0 ? Math.hypot(gx - prevGx, gy - prevGy) / dt : 0;
      prevGx = gx;
      prevGy = gy;
      const sweep = Math.min(1, speed / STIR_SPEED_REF);
      const stirring = pointerSeen && glow > 0.01 && sweep > 0.001;

      const damp = Math.exp(-DAMPING * dt);
      const margin = 24;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Ambient drift moves the HOME point, so the field keeps flowing
        // even while a mote is displaced.
        p.hx += p.vx * dt;
        p.hy += p.vy * dt;

        if (p.hx < -margin) {
          p.hx = width + margin;
          p.x = p.hx;
        } else if (p.hx > width + margin) {
          p.hx = -margin;
          p.x = p.hx;
        }
        if (p.hy < -margin) {
          p.hy = height + margin;
          p.y = p.hy;
        } else if (p.hy > height + margin) {
          p.hy = -margin;
          p.y = p.hy;
        }

        // ── Cursor impulse ──────────────────────────────────────────
        if (stirring) {
          const ox = p.x - gx;
          const oy = p.y - gy;
          const dist = Math.sqrt(ox * ox + oy * oy);
          if (dist < STIR_RADIUS && dist > 0.0001) {
            const f = 1 - dist / STIR_RADIUS;
            const mag = (STIR_FORCE * f * f * sweep * glow) / p.m;
            const ux = ox / dist;
            const uy = oy / dist;
            // Radial shove plus a tangential component — the curl is what
            // makes it read as powder caught in a draught, not an explosion.
            p.dx += (ux + -uy * STIR_SWIRL) * mag * dt;
            p.dy += (uy + ux * STIR_SWIRL) * mag * dt;
          }
        }

        // ── Integrate, damp, and spring home ────────────────────────
        p.x += p.dx * dt;
        p.y += p.dy * dt;

        p.dx *= damp;
        p.dy *= damp;

        const bx = p.hx - p.x;
        const by = p.hy - p.y;
        p.dx += bx * RETURN_SPRING * dt;
        p.dy += by * RETURN_SPRING * dt;

        // Never let a mote be flung so far it leaves its neighbourhood.
        const offset = Math.hypot(p.x - p.hx, p.y - p.hy);
        if (offset > MAX_OFFSET) {
          const k = MAX_OFFSET / offset;
          p.x = p.hx + (p.x - p.hx) * k;
          p.y = p.hy + (p.y - p.hy) * k;
        }
      }
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Pointer offset normalised to -1..1 about the centre, used to push the
      // clouds gently against the cursor for a sense of depth.
      const hasPointer = pointerSeen && glow > 0.001;
      const nx = hasPointer && width > 0 ? (gx / width) * 2 - 1 : 0;
      const ny = hasPointer && height > 0 ? (gy / height) * 2 - 1 : 0;

      for (let i = 0; i < BLOB_COUNT; i++) {
        const b = blobs[i];
        const r = b.radius * diagonal;
        // Nearer clouds (larger index) parallax further.
        const depth = ((i + 1) / BLOB_COUNT) * PARALLAX_MAX * glow;
        const x =
          b.cx * width + Math.sin(t * b.fx + b.phx) * b.ax * width - nx * depth;
        const y =
          b.cy * height + Math.cos(t * b.fy + b.phy) * b.ay * height - ny * depth;
        // Slow breathing keeps the cloud from looking like a decal.
        const breathe = 1 + Math.sin(t * b.fx * 0.6 + b.phy) * 0.09;
        const d = r * 2 * breathe;

        ctx.globalAlpha = b.alpha;
        ctx.drawImage(blobSprites[b.sprite], x - d / 2, y - d / 2, d, d);
      }

      // ── The cursor, drawn INTO the field ───────────────────────────
      // Same composite mode as the smoke, so in dark theme it adds light to
      // the clouds it passes over instead of stamping a disc on top.
      if (hasPointer) {
        const gd = GLOW_RADIUS * diagonal * 2;
        // A gentle pulse keeps it alive when the pointer is still.
        const pulse = 1 + Math.sin(t * 1.1) * 0.05;
        ctx.globalAlpha = GLOW_ALPHA * nebulaOpacity * glow;
        ctx.drawImage(
          glowSprite,
          gx - (gd * pulse) / 2,
          gy - (gd * pulse) / 2,
          gd * pulse,
          gd * pulse
        );
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const twinkle = 0.55 + 0.45 * Math.sin(t * p.tf + p.tp);
        const d = p.r * 2 * (0.85 + twinkle * 0.3) * 3.2; // sprite is mostly falloff

        // Position already carries the disturbance (see advance()). Motes that
        // are actively moving flare a little, so the wake reads as it travels.
        const motion = Math.hypot(p.dx, p.dy);
        const lift = 1 + Math.min(1.7, motion / 160);

        ctx.globalAlpha = Math.min(1, p.a * twinkle * lift);
        ctx.drawImage(particleSprite, p.x - d / 2, p.y - d / 2, d, d);
      }

      ctx.globalAlpha = 1;
    };

    /* — lifecycle — */
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let last = 0;
    let running = false;

    const frame = (now: number) => {
      const t = now * 0.001;
      let dt = last === 0 ? 0 : t - last;
      last = t;
      if (dt > MAX_FRAME_S) dt = MAX_FRAME_S;

      advance(dt);
      render(t);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    const start = () => {
      if (motionQuery.matches) {
        stop();
        render(0); // one static frame, no loop
        return;
      }
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      applySize();
      if (motionQuery.matches) render(0);
    };

    const onMotionChange = () => {
      stop();
      start();
    };

    /* — pointer plumbing —
       The canvas is pointer-events-none, so we listen on the window and the
       field reacts wherever the cursor is, including over cards and text. */
    const onPointerMove = (e: PointerEvent) => {
      // Coarse pointers (touch) get no cursor light — there is no cursor.
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      if (!pointerSeen) {
        // First sample: place the light directly so it does not sweep in
        // from the corner.
        pointerSeen = true;
        gx = px;
        gy = py;
      }
      glowTarget = 1;
    };

    const onPointerLeave = () => {
      glowTarget = 0;
    };

    const onPointerEnter = () => {
      if (pointerSeen) glowTarget = 1;
    };

    applySize();
    start();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block h-full w-full"
    />
  );
}
