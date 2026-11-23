"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural cloud wisps rendered on a full-screen canvas.
 *
 * Each wisp is a cluster of soft, fuzzy particles (radial-gradient puffs)
 * scattered along a bent spine. A wisp is rasterised once to an offscreen
 * canvas, then drifted across the sky. When it leaves the right edge it is
 * regenerated with new random parameters and re-enters from the left.
 */

type Puff = {
  x: number;
  y: number;
  r: number;
  a: number;
};

type Wisp = {
  sprite: HTMLCanvasElement;
  w: number;
  h: number;
  x: number;
  y: number;
  speed: number; // px per second
  depth: number; // 0..1, smaller = further away (slower, fainter)
  bobPhase: number;
  bobAmp: number;
};

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

// Approximate gaussian via the sum of three uniforms.
const gauss = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;

function makePuffs(length: number, thickness: number, count: number): Puff[] {
  const puffs: Puff[] = [];
  // Gentle bend so wisps are not perfectly straight.
  const bend = rand(-0.35, 0.35) * thickness;
  const taper = rand(0.55, 0.9);

  for (let i = 0; i < count; i++) {
    const t = Math.random();
    // Envelope: fat in the middle, thin at both ends.
    const envelope = Math.pow(Math.sin(t * Math.PI), taper);
    const x = t * length;
    const spine = bend * Math.sin(t * Math.PI);
    const y = spine + gauss() * thickness * 0.45 * (0.35 + envelope);
    const r = thickness * rand(0.25, 0.6) * (0.4 + envelope);
    const a = rand(0.05, 0.16) * (0.3 + envelope);
    puffs.push({ x, y, r, a });
  }
  return puffs;
}

function rasterise(puffs: Puff[], length: number, thickness: number, dpr: number) {
  const pad = thickness;
  const w = Math.ceil(length + pad * 2);
  const h = Math.ceil(thickness * 2 + pad * 2);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { canvas, w, h };
  ctx.scale(dpr, dpr);

  for (const p of puffs) {
    const cx = p.x + pad;
    const cy = p.y + thickness + pad;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.r);
    g.addColorStop(0, `rgba(255,255,255,${p.a})`);
    g.addColorStop(0.45, `rgba(255,255,255,${p.a * 0.55})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  return { canvas, w, h };
}

function makeWisp(viewW: number, viewH: number, dpr: number, startOnScreen: boolean): Wisp {
  const depth = rand(0.25, 1);
  const length = rand(220, 620) * (0.5 + depth * 0.7);
  const thickness = length * rand(0.14, 0.28);
  const count = Math.round(rand(28, 70) * (0.6 + depth * 0.6));
  const puffs = makePuffs(length, thickness, count);
  const { canvas, w, h } = rasterise(puffs, length, thickness, dpr);

  return {
    sprite: canvas,
    w,
    h,
    x: startOnScreen ? rand(-w, viewW) : -w - rand(0, viewW * 0.5),
    y: rand(-h * 0.3, viewH - h * 0.5),
    speed: rand(6, 16) * (0.4 + depth),
    depth,
    bobPhase: rand(0, Math.PI * 2),
    bobAmp: rand(2, 8),
  };
}

export default function Clouds({ count = 14 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let viewW = 0;
    let viewH = 0;
    let wisps: Wisp[] = [];
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      canvas.width = Math.ceil(viewW * dpr);
      canvas.height = Math.ceil(viewH * dpr);
      canvas.style.width = `${viewW}px`;
      canvas.style.height = `${viewH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Scale cloud count with viewport area so phones aren't crowded.
      const target = Math.max(5, Math.round(count * Math.min(1, (viewW * viewH) / (1440 * 900))));
      wisps = Array.from({ length: target }, () => makeWisp(viewW, viewH, dpr, true));
      wisps.sort((a, b) => a.depth - b.depth);
    };

    const draw = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, viewW, viewH);

      for (let i = 0; i < wisps.length; i++) {
        let c = wisps[i];
        if (!reduceMotion) {
          c.x += c.speed * dt;
          c.bobPhase += dt * 0.25;
        }
        if (c.x > viewW + 20) {
          c = makeWisp(viewW, viewH, dpr, false);
          wisps[i] = c;
        }
        const bob = Math.sin(c.bobPhase) * c.bobAmp;
        ctx.globalAlpha = 0.55 + c.depth * 0.45;
        ctx.drawImage(c.sprite, c.x, c.y + bob, c.w, c.h);
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduceMotion) draw(performance.now());
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return <canvas ref={ref} className="clouds" aria-hidden="true" />;
}
