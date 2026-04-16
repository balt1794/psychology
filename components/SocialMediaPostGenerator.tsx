"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImagePlus, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToolPageShell } from "@/components/ToolPageShell";
import { RelatedToolsCards } from "@/components/RelatedToolsCards";
import FreeRewritesLeft from "@/components/FreeRewritesLeft";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";

// ─── Types ──────────────────────────────────────────────────────────────────

type Template = "modern-split" | "full-frame" | "clean-card" | "listing-card";
type Format = "post" | "story";
type EditorField =
  | "headline"
  | "tagline"
  | "price"
  | "beds"
  | "baths"
  | "area"
  | "extra1"
  | "agent"
  | "phone"
  | "website"
  | "cta";

type EditorItem = {
  id: string;
  field: EditorField;
  x: number;
  y: number;
  size: number;
  color: string;
  weight?: "normal" | "bold";
  align?: CanvasTextAlign;
  uppercase?: boolean;
  pill?: boolean;
  pillPaddingX?: number;
  pillPaddingY?: number;
  maxW?: number;
};

interface Form {
  headline: string;
  tagline: string;
  price: string;
  beds: string;
  baths: string;
  area: string;
  extra1: string;
  extra2: string;
  agent: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  cta: string;
  accent: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULTS: Form = {
  headline: "Modern Home For Sale",
  tagline: "Start Your Dream Life Today",
  price: "$450,000",
  beds: "3",
  baths: "2",
  area: "1,800 sqft",
  extra1: "Swimming Pool",
  extra2: "2-Car Garage",
  agent: "Your Name",
  title: "Licensed Realtor",
  phone: "+1 (555) 000-0000",
  email: "you@example.com",
  website: "yourwebsite.com",
  cta: "Contact Us",
  accent: "#E31C5F",
};

const TEMPLATES: { id: Template; label: string; desc: string }[] = [
  { id: "modern-split", label: "Modern Split", desc: "Navy + photo side by side" },
];

/** Export pixel sizes — Full HD–class (1920px wide/tall) PNGs for crisp posting & print. */
const SIZES: Record<Format, { w: number; h: number }> = {
  post: { w: 1920, h: 1920 },
  story: { w: 1920, h: Math.round((1920 * 16) / 9) }, // 9:16 vertical, 1920 × 3413
};

const ACCENTS = ["#E31C5F", "#1B3A8F", "#1A7A50", "#C9A227", "#0D7377", "#111111"];

// ─── Canvas utilities ────────────────────────────────────────────────────────

function coverImg(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let sx: number, sy: number, sw: number, sh: number;
  if (ir > cr) {
    sw = img.naturalHeight * cr; sh = img.naturalHeight;
    sx = (img.naturalWidth - sw) / 2; sy = 0;
  } else {
    sw = img.naturalWidth; sh = img.naturalWidth / cr;
    sx = 0; sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** Trim text so it fits maxW, appending "…" if truncated. */
function trunc(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (!text || ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
}

/** Toggle a drop-shadow for text drawn over photos. Always call with false after to reset. */
function shadow(ctx: CanvasRenderingContext2D, on: boolean, blur = 14) {
  ctx.shadowColor = on ? "rgba(0,0,0,0.75)" : "transparent";
  ctx.shadowBlur = on ? blur : 0;
  ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
}

/** Draw a circular headshot avatar centred at (cx, cy) with radius r. */
function drawAvatar(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const size = r * 2;
  const ir = img.naturalWidth / img.naturalHeight;
  let dw = size, dh = size;
  if (ir > 1) { dh = size / ir; } else { dw = size * ir; }
  // object-fit: cover
  if (img.naturalWidth / img.naturalHeight > 1) {
    dw = size * (img.naturalWidth / img.naturalHeight); dh = size;
  } else {
    dh = size * (img.naturalHeight / img.naturalWidth); dw = size;
  }
  ctx.drawImage(img, cx - r - (dw - size) / 2, cy - r - (dh - size) / 2, dw, dh);
  ctx.restore();
  // Thin white border ring
  ctx.save();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = Math.max(2, r * 0.06);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function getFieldValue(form: Form, field: EditorField): string {
  switch (field) {
    case "beds": return `${form.beds} Beds`;
    case "baths": return `${form.baths} Baths`;
    case "area": return form.area;
    case "extra1": return form.extra1;
    default: return form[field] || "";
  }
}

function buildEditorLayout(template: Template, format: Format, W: number, H: number): EditorItem[] {
  const isStory = format === "story";
  if (template === "listing-card") {
    return [
      { id: "headline", field: "headline", x: W * 0.08, y: H * 0.53, size: H * 0.07, color: "#fff", weight: "bold", maxW: W * 0.82 },
      { id: "tagline", field: "tagline", x: W * 0.08, y: H * 0.08, size: H * 0.03, color: "#fff", maxW: W * 0.45 },
      { id: "price", field: "price", x: W * 0.92, y: H * 0.08, size: H * 0.048, color: "#fff", align: "right", weight: "bold" },
      { id: "beds", field: "beds", x: W * 0.15, y: H * 0.64, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "baths", field: "baths", x: W * 0.36, y: H * 0.64, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "area", field: "area", x: W * 0.57, y: H * 0.64, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "extra1", field: "extra1", x: W * 0.78, y: H * 0.64, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "agent", field: "agent", x: W * 0.08, y: H * 0.85, size: H * 0.043, color: "#222", weight: "bold", maxW: W * 0.46 },
      { id: "phone", field: "phone", x: W * 0.08, y: H * 0.89, size: H * 0.027, color: "#777", maxW: W * 0.45 },
      { id: "website", field: "website", x: W * 0.28, y: H * 0.89, size: H * 0.027, color: "#777", maxW: W * 0.22 },
      { id: "cta", field: "cta", x: W * 0.80, y: H * 0.90, size: H * 0.034, color: "#fff", align: "center", weight: "bold", uppercase: true, pill: true, pillPaddingX: W * 0.045, pillPaddingY: H * 0.018 },
    ];
  }

  if (template === "clean-card") {
    return [
      { id: "headline", field: "headline", x: W * 0.08, y: H * 0.52, size: H * 0.065, color: "#fff", weight: "bold", maxW: W * 0.84 },
      { id: "tagline", field: "tagline", x: W * 0.08, y: H * 0.08, size: H * 0.03, color: "#fff", maxW: W * 0.5 },
      { id: "price", field: "price", x: W * 0.92, y: H * 0.09, size: H * 0.045, color: "#fff", align: "right", weight: "bold", pill: true, pillPaddingX: W * 0.03, pillPaddingY: H * 0.012 },
      { id: "beds", field: "beds", x: W * 0.15, y: H * 0.67, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "baths", field: "baths", x: W * 0.36, y: H * 0.67, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "area", field: "area", x: W * 0.57, y: H * 0.67, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "extra1", field: "extra1", x: W * 0.78, y: H * 0.67, size: H * 0.038, color: "#111", weight: "bold" },
      { id: "agent", field: "agent", x: W * 0.08, y: H * 0.87, size: H * 0.042, color: "#222", weight: "bold", maxW: W * 0.45 },
      { id: "phone", field: "phone", x: W * 0.08, y: H * 0.91, size: H * 0.027, color: "#888", maxW: W * 0.42 },
      { id: "website", field: "website", x: W * 0.28, y: H * 0.91, size: H * 0.027, color: "#888", maxW: W * 0.22 },
      { id: "cta", field: "cta", x: W * 0.80, y: H * 0.905, size: H * 0.033, color: "#fff", align: "center", weight: "bold", uppercase: true, pill: true, pillPaddingX: W * 0.042, pillPaddingY: H * 0.017 },
    ];
  }

  if (template === "full-frame") {
    return [
      { id: "headline", field: "headline", x: W * 0.08, y: H * 0.10, size: H * 0.05, color: "#fff", weight: "bold", maxW: W * 0.56 },
      { id: "price", field: "price", x: W * 0.86, y: H * 0.10, size: H * 0.04, color: "#fff", align: "center", weight: "bold", pill: true, pillPaddingX: W * 0.03, pillPaddingY: H * 0.012 },
      { id: "beds", field: "beds", x: W * 0.12, y: H * 0.77, size: H * 0.04, color: "#fff", weight: "bold" },
      { id: "baths", field: "baths", x: W * 0.52, y: H * 0.77, size: H * 0.04, color: "#fff", weight: "bold" },
      { id: "area", field: "area", x: W * 0.12, y: H * 0.85, size: H * 0.04, color: "#fff", weight: "bold" },
      { id: "extra1", field: "extra1", x: W * 0.52, y: H * 0.85, size: H * 0.04, color: "#fff", weight: "bold" },
      { id: "agent", field: "agent", x: W * 0.08, y: H * 0.69, size: H * 0.032, color: "#fff", weight: "bold", maxW: W * 0.42 },
      { id: "phone", field: "phone", x: W * 0.92, y: H * 0.90, size: H * 0.023, color: "rgba(255,255,255,0.72)", align: "right", maxW: W * 0.42 },
      { id: "website", field: "website", x: W * 0.92, y: H * 0.94, size: H * 0.023, color: "rgba(255,255,255,0.72)", align: "right", maxW: W * 0.42 },
      { id: "cta", field: "cta", x: W * 0.25, y: H * 0.91, size: H * 0.03, color: "#fff", align: "center", weight: "bold", uppercase: true, pill: true, pillPaddingX: W * 0.035, pillPaddingY: H * 0.015 },
    ];
  }

  // modern-split
  return [
    { id: "headline", field: "headline", x: W * 0.08, y: isStory ? H * 0.56 : H * 0.26, size: H * (isStory ? 0.055 : 0.064), color: "#fff", weight: "bold", maxW: isStory ? W * 0.84 : W * 0.34 },
    { id: "tagline", field: "tagline", x: W * 0.08, y: isStory ? H * 0.52 : H * 0.34, size: H * (isStory ? 0.028 : 0.024), color: "rgba(255,255,255,0.84)", maxW: isStory ? W * 0.84 : W * 0.34 },
    { id: "price", field: "price", x: W * 0.88, y: isStory ? H * 0.07 : H * 0.10, size: H * 0.04, color: "#fff", align: "center", weight: "bold", pill: true, pillPaddingX: W * 0.03, pillPaddingY: H * 0.012 },
    { id: "beds", field: "beds", x: isStory ? W * 0.08 : W * 0.08, y: isStory ? H * 0.75 : H * 0.64, size: H * 0.03, color: "#fff", weight: "bold", maxW: isStory ? W * 0.84 : W * 0.32 },
    { id: "baths", field: "baths", x: isStory ? W * 0.08 : W * 0.08, y: isStory ? H * 0.79 : H * 0.69, size: H * 0.03, color: "#fff", weight: "bold", maxW: isStory ? W * 0.84 : W * 0.32 },
    { id: "area", field: "area", x: isStory ? W * 0.08 : W * 0.08, y: isStory ? H * 0.83 : H * 0.74, size: H * 0.03, color: "#fff", weight: "bold", maxW: isStory ? W * 0.84 : W * 0.32 },
    { id: "extra1", field: "extra1", x: isStory ? W * 0.08 : W * 0.08, y: isStory ? H * 0.87 : H * 0.79, size: H * 0.03, color: "#fff", weight: "bold", maxW: isStory ? W * 0.84 : W * 0.32 },
    { id: "agent", field: "agent", x: W * 0.08, y: isStory ? H * 0.49 : H * 0.18, size: H * 0.024, color: "rgba(255,255,255,0.72)", weight: "bold", maxW: isStory ? W * 0.84 : W * 0.32 },
    { id: "phone", field: "phone", x: isStory ? W * 0.08 : W * 0.08, y: isStory ? H * 0.94 : H * 0.95, size: H * 0.018, color: "rgba(255,255,255,0.62)", maxW: isStory ? W * 0.84 : W * 0.32 },
    { id: "website", field: "website", x: isStory ? W * 0.62 : W * 0.17, y: isStory ? H * 0.94 : H * 0.95, size: H * 0.018, color: "rgba(255,255,255,0.62)", maxW: isStory ? W * 0.3 : W * 0.2 },
    { id: "cta", field: "cta", x: isStory ? W * 0.5 : W * 0.2, y: isStory ? H * 0.90 : H * 0.91, size: H * 0.03, color: "#fff", align: "center", weight: "bold", uppercase: true, pill: true, pillPaddingX: W * (isStory ? 0.05 : 0.04), pillPaddingY: H * 0.014 },
  ];
}

function drawFlexibleBackground(
  ctx: CanvasRenderingContext2D,
  template: Template,
  img: HTMLImageElement | null,
  W: number,
  H: number,
  accent: string,
) {
  const isStory = H > W;
  const pad = W * 0.055;
  if (template === "listing-card") {
    const barH = H * (isStory ? 0.18 : 0.28);
    const photoH = H - barH;
    if (img) coverImg(ctx, img, 0, 0, W, photoH);
    else { ctx.fillStyle = "#C8D4E4"; ctx.fillRect(0, 0, W, photoH); }
    const grd = ctx.createLinearGradient(0, photoH * 0.5, 0, photoH);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, photoH);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, photoH, W, barH);
    ctx.fillStyle = accent; ctx.fillRect(0, photoH, W, 5);
    return;
  }

  if (template === "clean-card") {
    const photoH = H * 0.56;
    if (img) coverImg(ctx, img, 0, 0, W, photoH);
    else { ctx.fillStyle = "#C8D4E4"; ctx.fillRect(0, 0, W, photoH); }
    const grd = ctx.createLinearGradient(0, photoH * 0.35, 0, photoH);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "rgba(0,0,0,0.78)");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, photoH);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, photoH, W, H - photoH);
    ctx.fillStyle = accent; ctx.fillRect(0, photoH, W * 0.14, 6);
    ctx.fillStyle = "#EFEFEF"; ctx.fillRect(W * 0.14, photoH, W * 0.86, 6);
    return;
  }

  if (template === "full-frame") {
    const headH = H * (isStory ? 0.1 : 0.15);
    const footH = H * (isStory ? 0.36 : 0.38);
    if (img) coverImg(ctx, img, 0, headH, W, H - headH - footH);
    else { ctx.fillStyle = "#C8D4E4"; ctx.fillRect(0, headH, W, H - headH - footH); }
    ctx.fillStyle = "#0A1628"; ctx.fillRect(0, 0, W, headH);
    ctx.fillStyle = accent; ctx.fillRect(0, headH - 4, W, 4);
    ctx.fillStyle = "#0A1628"; ctx.fillRect(0, H - footH, W, footH);
    return;
  }

  // modern-split background
  ctx.fillStyle = "#0D1F3C"; ctx.fillRect(0, 0, W, H);
  if (isStory) {
    const photoH = H * 0.46;
    if (img) coverImg(ctx, img, 0, 0, W, photoH);
    const grd = ctx.createLinearGradient(0, photoH * 0.5, 0, photoH);
    grd.addColorStop(0, "rgba(13,31,60,0)");
    grd.addColorStop(1, "rgba(13,31,60,1)");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, photoH);
  } else {
    const splitX = W * 0.43;
    if (img) coverImg(ctx, img, splitX, 0, W - splitX, H);
    const grd = ctx.createLinearGradient(splitX, 0, splitX + W * 0.12, 0);
    grd.addColorStop(0, "rgba(13,31,60,0.92)");
    grd.addColorStop(1, "rgba(13,31,60,0)");
    ctx.fillStyle = grd; ctx.fillRect(splitX, 0, W * 0.14, H);
    ctx.fillStyle = accent; ctx.fillRect(0, H - H * 0.11, splitX + W * 0.03, H * 0.11);
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillText("", pad, pad);
  }
}

function drawEditorItems(
  ctx: CanvasRenderingContext2D,
  items: EditorItem[],
  form: Form,
  accent: string,
  selectedId: string | null,
): Record<string, { x: number; y: number; w: number; h: number }> {
  const bounds: Record<string, { x: number; y: number; w: number; h: number }> = {};
  for (const item of items) {
    const valueRaw = getFieldValue(form, item.field);
    if (!valueRaw) continue;
    const value = item.uppercase ? valueRaw.toUpperCase() : valueRaw;
    const align = item.align ?? "left";
    ctx.textAlign = align;
    ctx.font = `${item.weight ?? "normal"} ${item.size}px Arial`;
    shadow(ctx, item.color.includes("fff") || item.color.includes("255"), 10);
    const text = trunc(ctx, value, item.maxW ?? 1e6);
    const tw = ctx.measureText(text).width;
    const th = item.size * 1.1;
    let boxX = item.x;
    if (align === "center") boxX = item.x - tw / 2;
    if (align === "right") boxX = item.x - tw;
    let boxY = item.y - th * 0.8;
    let boxW = tw;
    let boxH = th;

    if (item.pill) {
      const px = item.pillPaddingX ?? 18;
      const py = item.pillPaddingY ?? 10;
      boxX -= px;
      boxY -= py;
      boxW += px * 2;
      boxH += py * 2;
      ctx.fillStyle = accent;
      pill(ctx, boxX, boxY, boxW, boxH, Math.min(14, boxH / 2));
    }

    ctx.fillStyle = item.color;
    ctx.fillText(text, item.x, item.y);
    shadow(ctx, false);

    bounds[item.id] = { x: boxX, y: boxY, w: boxW, h: boxH };
    if (selectedId === item.id) {
      ctx.save();
      ctx.strokeStyle = "#FF385C";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(boxX - 4, boxY - 4, boxW + 8, boxH + 8);
      ctx.restore();
    }
  }
  return bounds;
}

// ─── Template: Modern Split ──────────────────────────────────────────────────

function renderModernSplit(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, f: Form, W: number, H: number, headshot: HTMLImageElement | null = null) {
  const navy = "#0D1F3C";
  const pad = W * 0.055;
  const isStory = H > W;

  ctx.fillStyle = navy;
  ctx.fillRect(0, 0, W, H);

  if (isStory) {
    const photoH = H * 0.40;
    if (img) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, photoH); ctx.clip();
      coverImg(ctx, img, 0, 0, W, photoH);
      const grd = ctx.createLinearGradient(0, photoH * 0.55, 0, photoH);
      grd.addColorStop(0, "rgba(13,31,60,0)"); grd.addColorStop(1, "rgba(13,31,60,1)");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, photoH);
      ctx.restore();
    }
    // Story price pill — modest corner radius (not full capsule)
    const bw = W * 0.38, bh = H * 0.074; const bx = W - pad - bw, by = H * 0.024;
    const storyPillR = Math.min(bh * 0.28, W * 0.022);
    ctx.fillStyle = f.accent; pill(ctx, bx, by, bw, bh, storyPillR);
    ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
    ctx.font = `500 ${H * 0.015}px Arial`; ctx.fillText("PRICE", bx + bw / 2, by + bh * 0.36);
    ctx.font = `bold ${H * 0.028}px Arial`; ctx.fillText(trunc(ctx, f.price, bw * 0.88), bx + bw / 2, by + bh * 0.73);

    // Story content: headline + tagline + features first (sits higher), then agent row above footer
    let cy = photoH + H * 0.018;
    ctx.textAlign = "left";
    shadow(ctx, true, 10);
    ctx.fillStyle = "#FFF"; ctx.font = `bold ${H * 0.058}px Arial`;
    for (const l of wrap(ctx, f.headline.toUpperCase(), W - pad * 2)) { ctx.fillText(l, pad, cy); cy += H * 0.048; }
    cy += H * 0.002;

    if (f.tagline) {
      ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.font = `${H * 0.026}px Arial`;
      for (const l of wrap(ctx, f.tagline, W - pad * 2)) { ctx.fillText(l, pad, cy); cy += H * 0.034; }
    }
    cy += H * 0.008;

    const featFont = H * 0.028;
    ctx.font = `${featFont}px Arial`;
    const feats = [`${f.beds} Bedrooms`, `${f.baths} Bathrooms`, f.area, f.extra1, f.extra2].filter(Boolean);
    const featLine = H * 0.042;
    const bulletR = Math.max(8, featFont * 0.22);
    const featBulletGap = H * 0.018;
    const bulletCx = pad + bulletR + 4;
    const featTextX = bulletCx + bulletR + featBulletGap;
    const featTextMaxW = W - pad - featTextX;
    for (const feat of feats) {
      ctx.fillStyle = f.accent; ctx.beginPath(); ctx.arc(bulletCx, cy - featFont * 0.35, bulletR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(trunc(ctx, feat, featTextMaxW), featTextX, cy); cy += featLine;
    }
    shadow(ctx, false);

    cy += H * 0.034;
    // Headshot (left) + name/title (right) aligned on same row
    const nameCy = cy - H * 0.026;
    const storyAvaR = headshot ? H * 0.04 : 0;
    const nameFontSz = H * 0.022;
    const titleFontSz = H * 0.017;
    const websiteFontSz = H * 0.0155;
    const gapTextAvatar = H * 0.016;
    const avatarCX = headshot ? pad + storyAvaR : 0;
    const textX = headshot ? avatarCX + storyAvaR + gapTextAvatar : pad;
    const hasTitle = Boolean((f.title || "").trim());
    const hasWebsite = Boolean((f.website || "").trim());
    const nameLineGap = H * 0.03;
    const titleBaseline = nameCy + nameLineGap;
    const websiteBaseline = titleBaseline + H * 0.024;
    const nameTop = nameCy - nameFontSz * 0.85;
    const blockBot = hasWebsite
      ? websiteBaseline + websiteFontSz * 0.4
      : hasTitle
        ? titleBaseline + titleFontSz * 0.4
        : nameCy + nameFontSz * 0.25;
    const blockMidY = (nameTop + blockBot) / 2;
    const textMaxW = headshot ? Math.max(200, W - pad - textX) : W - pad * 2;

    if (headshot) drawAvatar(ctx, headshot, avatarCX, blockMidY, storyAvaR);

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.font = `bold ${nameFontSz}px Arial`;
    ctx.fillText(trunc(ctx, f.agent.toUpperCase(), textMaxW), textX, nameCy);
    if (hasTitle) {
      ctx.fillStyle = "rgba(255,255,255,0.68)"; ctx.font = `${titleFontSz}px Arial`;
      ctx.fillText(trunc(ctx, f.title.trim(), textMaxW), textX, titleBaseline);
    }
    if (hasWebsite) {
      ctx.fillStyle = "rgba(255,255,255,0.62)"; ctx.font = `${websiteFontSz}px Arial`;
      ctx.fillText(trunc(ctx, f.website.trim(), textMaxW), textX, hasTitle ? websiteBaseline : titleBaseline);
    }
    const accentY = hasWebsite
      ? (hasTitle ? websiteBaseline : titleBaseline) + H * 0.016
      : hasTitle
        ? titleBaseline + H * 0.018
        : nameCy + H * 0.01;
    const accentW = Math.min(W * 0.08, textMaxW * 0.25);
    ctx.fillStyle = f.accent; ctx.fillRect(textX, accentY, accentW, 3);

    // Footer: CTA, then one-line contact row (phone + email)
    const contactY = H - pad * 1.03;
    const ctaGap = H * 0.032;
    const ctaBtnH = H * 0.060;
    const ctaBtnY = contactY - ctaGap - ctaBtnH - H * 0.008;
    const ctaPillR = Math.min(ctaBtnH * 0.22, W * 0.018);
    ctx.fillStyle = f.accent; pill(ctx, pad, ctaBtnY, W - pad * 2, ctaBtnH, ctaPillR);
    ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
    const ctaFont = Math.min(H * 0.027, (W - pad * 2) * 0.1);
    ctx.font = `bold ${ctaFont}px Arial`;
    ctx.fillText(trunc(ctx, f.cta.toUpperCase(), W - pad * 4), W / 2, ctaBtnY + ctaBtnH * 0.64);
    shadow(ctx, false);
    ctx.textAlign = "center";
    const emailLine = (f.email || "").trim() || f.website;
    const contactInline = `${f.phone}  •  ${emailLine}`;
    ctx.font = `${H * 0.0185}px Arial`; ctx.fillStyle = "#FFFFFF";
    ctx.fillText(trunc(ctx, contactInline, W - pad * 2), W / 2, contactY);
    return;
  }

  // Post: left navy (43%), right photo with diagonal
  const splitX = W * 0.43, diagW = W * 0.07;
  const leftW = splitX - pad * 1.4; // safe text width for left panel

  if (img) {
    ctx.save();
    ctx.beginPath(); ctx.moveTo(splitX + diagW, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(splitX, H); ctx.closePath(); ctx.clip();
    coverImg(ctx, img, splitX, 0, W - splitX, H);
    const grd = ctx.createLinearGradient(splitX, 0, splitX + W * 0.1, 0);
    grd.addColorStop(0, "rgba(13,31,60,0.9)"); grd.addColorStop(1, "rgba(13,31,60,0)");
    ctx.fillStyle = grd; ctx.fillRect(splitX, 0, W * 0.12, H);
    ctx.restore();
  }

  // Price badge — fits inside right photo area, bounded to right panel width
  const rightPanelW = W - splitX - diagW;
  const bw = Math.min(W * 0.28, rightPanelW * 0.8), bh = H * 0.075;
  const bx = W - pad - bw;
  ctx.fillStyle = f.accent; pill(ctx, bx, H * 0.05, bw, bh, 10);
  ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
  ctx.font = `500 ${H * 0.016}px Arial`; ctx.fillText("STARTING PRICE", bx + bw / 2, H * 0.05 + bh * 0.30);
  ctx.font = `bold ${H * 0.035}px Arial`; ctx.fillText(trunc(ctx, f.price, bw * 0.88), bx + bw / 2, H * 0.05 + bh * 0.81);

  let cy = H * 0.11;
  ctx.textAlign = "left";
  // Keep top section focused on headline/content first.
  // Agent/headshot block is rendered after feature content.

  ctx.fillStyle = "#FFF"; ctx.font = `bold ${H * 0.063}px Arial`;
  for (const l of wrap(ctx, f.headline.toUpperCase(), leftW)) { ctx.fillText(l, pad, cy); cy += H * 0.071; }
  cy += H * 0.01;

  if (f.tagline) {
    ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.font = `${H * 0.024}px Arial`;
    const postTaglineOffsetY = H * 0.01;
    for (const l of wrap(ctx, f.tagline, leftW)) { ctx.fillText(l, pad, cy - postTaglineOffsetY); cy += H * 0.044; }
    cy += H * 0.018;
  }

  // Features follow headline/tagline immediately — do not pin to mid-canvas (old H*0.50 hid layout tweaks)
  const featFont = H * 0.032;
  ctx.font = `${featFont}px Arial`;
  const featLine = H * 0.038;
  const bulletR = Math.max(5, featFont * 0.18);
  const featBulletGap = H * 0.016;
  const bulletCx = pad + bulletR + 3;
  const featTextX = bulletCx + bulletR + featBulletGap;
  const featTextMaxW = Math.max(40, pad + leftW - featTextX - 4);
  const feats = [`${f.beds} Bedrooms`, `${f.baths} Bathrooms`, f.area, f.extra1, f.extra2].filter(Boolean);
  for (const feat of feats) {
    ctx.fillStyle = f.accent; ctx.beginPath(); ctx.arc(bulletCx, cy - featFont * 0.32, bulletR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(trunc(ctx, feat, featTextMaxW), featTextX, cy); cy += featLine;
  }

  // Headshot (left) + name/title (right) — inside navy panel
  const postAvaR = headshot ? H * 0.036 : 0;
  const nameFontSz = H * 0.024;
  const titleFontSz = H * 0.018;
  const websiteFontSz = H * 0.016;
  const gapTextAvatar = H * 0.012;
  const avatarCX = headshot ? pad + postAvaR : 0;
  const textX = headshot ? avatarCX + postAvaR + gapTextAvatar : pad;
  const hasTitlePost = Boolean((f.title || "").trim());
  const hasWebsitePost = Boolean((f.website || "").trim());
  const nameY = Math.min(cy + H * 0.02, hasTitlePost ? H * 0.795 : H * 0.83);
  const titleBaseline = nameY + H * 0.028;
  const websiteBaseline = titleBaseline + H * 0.024;
  const nameTop = nameY - nameFontSz * 0.85;
  const blockBotPost = hasWebsitePost
    ? websiteBaseline + websiteFontSz * 0.4
    : hasTitlePost
      ? titleBaseline + titleFontSz * 0.4
      : nameY + nameFontSz * 0.25;
  const blockMidY = (nameTop + blockBotPost) / 2;
  const textMaxW = headshot ? Math.max(120, leftW - (textX - pad)) : leftW;

  if (headshot) drawAvatar(ctx, headshot, avatarCX, blockMidY, postAvaR);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.font = `bold ${nameFontSz}px Arial`;
  ctx.fillText(trunc(ctx, f.agent.toUpperCase(), textMaxW), textX, nameY);
  if (hasTitlePost) {
    ctx.fillStyle = "rgba(255,255,255,0.68)"; ctx.font = `${titleFontSz}px Arial`;
    ctx.fillText(trunc(ctx, f.title.trim(), textMaxW), textX, titleBaseline);
  }
  if (hasWebsitePost) {
    ctx.fillStyle = "rgba(255,255,255,0.62)"; ctx.font = `${websiteFontSz}px Arial`;
    ctx.fillText(trunc(ctx, f.website.trim(), textMaxW), textX, hasTitlePost ? websiteBaseline : titleBaseline);
  }
  const accentYPost = hasWebsitePost
    ? (hasTitlePost ? websiteBaseline : titleBaseline) + H * 0.016
    : hasTitlePost
      ? titleBaseline + H * 0.018
      : nameY + H * 0.008;
  const accentWPost = Math.min(W * 0.07, textMaxW * 0.22);
  ctx.fillStyle = f.accent; ctx.fillRect(textX, accentYPost, accentWPost, 3);

  // CTA bar (left side only, matching left panel width) — room for phone + email in white
  const ctaBarW = splitX + diagW * 0.5;
  const barH = H * 0.13;
  ctx.fillStyle = f.accent; ctx.fillRect(0, H - barH, ctaBarW, barH);
  ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
  const ctaFont = Math.min(H * 0.03, ctaBarW * 0.12);
  ctx.font = `bold ${ctaFont}px Arial`;
  ctx.fillText(trunc(ctx, f.cta.toUpperCase(), ctaBarW * 0.88), ctaBarW / 2, H - barH + barH * 0.28);
  ctx.font = `${H * 0.021}px Arial`; ctx.fillStyle = "#FFFFFF";
  ctx.fillText(trunc(ctx, f.phone, ctaBarW * 0.92), ctaBarW / 2, H - barH + barH * 0.58);
  const emailPost = (f.email || "").trim() || f.website;
  ctx.font = `${H * 0.021}px Arial`; ctx.fillStyle = "#FFFFFF";
  ctx.fillText(trunc(ctx, emailPost, ctaBarW * 0.92), ctaBarW / 2, H - barH + barH * 0.82);
}

// ─── Template: Full Frame ────────────────────────────────────────────────────

function renderFullFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, f: Form, W: number, H: number, headshot: HTMLImageElement | null = null) {
  const navy = "#0A1628";
  const pad = W * 0.055;
  const isStory = H > W;
  const headerH = H * (isStory ? 0.1 : 0.15);
  const footerH = H * (isStory ? 0.36 : 0.38);
  const photoH = H - headerH - footerH;

  if (img) coverImg(ctx, img, 0, headerH, W, photoH);
  else { ctx.fillStyle = "#2A3A50"; ctx.fillRect(0, headerH, W, photoH); }

  // Header
  ctx.fillStyle = navy; ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = f.accent; ctx.fillRect(0, headerH - 4, W, 4);

  // Headline — wrap within left 65% of header to leave room for price
  const headMaxW = W - pad * 2 - W * 0.32;
  ctx.textAlign = "left"; ctx.fillStyle = "#FFF";
  const headFont = Math.min(headerH * 0.38, H * 0.052);
  ctx.font = `bold ${headFont}px Arial`;
  const headLines = wrap(ctx, f.headline, headMaxW);
  let hy = (headerH - headFont * headLines.length) / 2 + headFont * 0.85;
  for (const l of headLines) { ctx.fillText(l, pad, hy); hy += headFont * 1.15; }

  // Price pill — right side of header
  const pw = W * 0.26, ph = Math.min(headerH * 0.44, H * 0.055);
  const px = W - pad - pw, py = (headerH - ph) / 2;
  ctx.fillStyle = f.accent; pill(ctx, px, py, pw, ph, ph / 2);
  ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
  const priceFont = Math.min(headerH * 0.27, ph * 0.55);
  ctx.font = `bold ${priceFont}px Arial`;
  ctx.fillText(trunc(ctx, f.price, pw * 0.88), px + pw / 2, py + ph * 0.68);

  // "For Sale" tag on photo
  const lbW = W * 0.22, lbH = H * 0.046;
  ctx.fillStyle = f.accent; pill(ctx, W - pad - lbW, headerH + H * 0.02, lbW, lbH, lbH / 2);
  shadow(ctx, true, 10);
  ctx.fillStyle = "#FFF"; ctx.font = `bold ${lbH * 0.48}px Arial`;
  ctx.fillText("FOR SALE", W - pad - lbW / 2, headerH + H * 0.02 + lbH * 0.68);
  shadow(ctx, false);

  // Footer
  ctx.fillStyle = navy; ctx.fillRect(0, H - footerH, W, footerH);
  ctx.fillStyle = f.accent; ctx.fillRect(0, H - footerH, W * 0.1, 4);

  // Agent name (with optional headshot avatar)
  const agentFont = Math.min(footerH * 0.1, H * 0.028);
  const avaR = headshot ? agentFont * 1.05 : 0;
  const avaCX = headshot ? pad + avaR : 0;
  const agentX = headshot ? avaCX + avaR + pad * 0.5 : pad;
  if (headshot) drawAvatar(ctx, headshot, avaCX, H - footerH + footerH * 0.085, avaR);
  ctx.textAlign = "left"; ctx.fillStyle = f.accent;
  ctx.font = `bold ${agentFont}px Arial`;
  ctx.fillText(trunc(ctx, f.agent.toUpperCase(), W - agentX - pad), agentX, H - footerH + footerH * 0.14);

  ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, H - footerH + footerH * 0.21); ctx.lineTo(W - pad, H - footerH + footerH * 0.21); ctx.stroke();

  // Feature grid — 2 columns, font bounded by cell width
  const feats = [
    { v: f.beds, l: "Bedrooms" }, { v: f.baths, l: "Bathrooms" }, { v: f.area, l: "Area" }, { v: f.extra1, l: "Feature" },
  ].filter(x => x.v.trim());
  const cols = feats.length > 2 ? 2 : feats.length;
  const rows = Math.ceil(feats.length / cols);
  const cellW = (W - pad * 2) / cols;
  const valFont = Math.min(footerH * 0.15, cellW * 0.26, H * 0.042);
  const lblFont = Math.min(footerH * 0.09, cellW * 0.16);
  const featStartY = H - footerH + footerH * 0.27;
  const rowH = (footerH * 0.45) / rows;

  for (let i = 0; i < feats.length; i++) {
    const col = i % cols; const row = Math.floor(i / cols);
    const cx = pad + col * cellW; const fy = featStartY + row * rowH;
    ctx.fillStyle = "#FFF"; ctx.font = `bold ${valFont}px Arial`; ctx.textAlign = "left";
    ctx.fillText(trunc(ctx, feats[i].v, cellW * 0.88), cx, fy + valFont * 1.05);
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = `${lblFont}px Arial`;
    ctx.fillText(feats[i].l, cx, fy + valFont * 1.05 + lblFont * 1.4);
    if (col < cols - 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx + cellW, fy + rowH * 0.05); ctx.lineTo(cx + cellW, fy + rowH * 0.9); ctx.stroke();
    }
  }

  // CTA row — left button, right contact info (no overlap)
  const ctaZoneY = H - footerH * 0.24;
  const ctaBtnH = footerH * 0.18;
  const ctaBtnW = Math.min(W * 0.38, W * 0.5 - pad);
  ctx.fillStyle = f.accent; pill(ctx, pad, ctaZoneY, ctaBtnW, ctaBtnH, 10);
  ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
  const ctaFont = Math.min(footerH * 0.105, ctaBtnW * 0.13);
  ctx.font = `bold ${ctaFont}px Arial`;
  ctx.fillText(trunc(ctx, f.cta.toUpperCase(), ctaBtnW * 0.86), pad + ctaBtnW / 2, ctaZoneY + ctaBtnH * 0.66);

  // Contact info — right side, bounded to not overlap CTA button
  const contactX = pad + ctaBtnW + W * 0.04;
  const contactMaxW = W - pad - contactX;
  const subFont = Math.min(footerH * 0.082, H * 0.022);
  ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `${subFont}px Arial`;
  ctx.fillText(trunc(ctx, f.phone, contactMaxW), W - pad, ctaZoneY + ctaBtnH * 0.4);
  ctx.fillText(trunc(ctx, f.website, contactMaxW), W - pad, ctaZoneY + ctaBtnH * 0.85);
}

// ─── Template: Clean Card ─────────────────────────────────────────────────────

function renderCleanCard(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, f: Form, W: number, H: number, headshot: HTMLImageElement | null = null) {
  const photoH = H * 0.56;
  const infoH = H - photoH;
  const pad = W * 0.06;

  if (img) coverImg(ctx, img, 0, 0, W, photoH);
  else { ctx.fillStyle = "#C8D4E4"; ctx.fillRect(0, 0, W, photoH); }

  // Photo gradient
  const grd = ctx.createLinearGradient(0, photoH * 0.38, 0, photoH);
  grd.addColorStop(0, "rgba(0,0,0,0)"); grd.addColorStop(1, "rgba(0,0,0,0.76)");
  ctx.fillStyle = grd; ctx.fillRect(0, 0, W, photoH);

  // Tagline (top-left of photo) — shadow for readability on any photo
  shadow(ctx, true, 16);
  if (f.tagline) {
    ctx.textAlign = "left"; ctx.fillStyle = "#FFF";
    ctx.font = `${H * 0.022}px Arial`;
    ctx.fillText(trunc(ctx, f.tagline, W * 0.6), pad, H * 0.07);
  }

  // Price (top-right) — pill badge so it pops on any background
  shadow(ctx, false);
  const pricePillW = W * 0.28, pricePillH = H * 0.07;
  ctx.fillStyle = "rgba(0,0,0,0.52)"; pill(ctx, W - pad - pricePillW, H * 0.035, pricePillW, pricePillH, 8);
  shadow(ctx, true, 8);
  ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `600 ${H * 0.016}px Arial`;
  ctx.fillText("PRICE", W - pad - pricePillW / 2, H * 0.035 + pricePillH * 0.37);
  ctx.fillStyle = f.accent; ctx.font = `bold ${H * 0.036}px Arial`;
  ctx.fillText(trunc(ctx, f.price, pricePillW * 0.9), W - pad - pricePillW / 2, H * 0.035 + pricePillH * 0.78);

  // Headline — big, bold, with strong shadow
  shadow(ctx, true, 20);
  ctx.textAlign = "left"; ctx.fillStyle = "#FFF";
  ctx.font = `bold ${H * 0.062}px Arial`;
  const tLines = wrap(ctx, f.headline, W - pad * 2);
  let ty = photoH - H * 0.07 * (tLines.length - 1) - H * 0.062;
  for (const l of tLines) { ctx.fillText(l, pad, ty); ty += H * 0.072; }
  shadow(ctx, false);

  // White info section
  ctx.fillStyle = "#FFF"; ctx.fillRect(0, photoH, W, infoH);
  ctx.fillStyle = f.accent; ctx.fillRect(0, photoH, W * 0.14, 6);
  ctx.fillStyle = "#EFEFEF"; ctx.fillRect(W * 0.14, photoH, W * 0.86, 6);

  // Feature stats
  const feats = [
    { v: f.beds, l: "Beds" }, { v: f.baths, l: "Baths" }, { v: f.area, l: "Area" },
    ...(f.extra1 ? [{ v: f.extra1, l: "Feature" }] : []),
  ].filter(x => x.v.trim());
  const cols = Math.min(feats.length, 4);
  const cellW = (W - pad * 2) / cols;
  // Bigger values — bounded by cell width to prevent overflow
  const valFont = Math.min(H * 0.03, cellW * 0.24);
  const lblFont = Math.min(H * 0.016, cellW * 0.14);
  const statsY = photoH + infoH * 0.12;

  for (let i = 0; i < feats.length; i++) {
    const cx = pad + i * cellW + cellW / 2;
    ctx.fillStyle = "#111"; ctx.font = `bold ${valFont}px Arial`; ctx.textAlign = "center";
    ctx.fillText(trunc(ctx, feats[i].v, cellW * 0.86), cx, statsY + valFont * 1.15);
    ctx.fillStyle = "#888"; ctx.font = `${lblFont}px Arial`;
    ctx.fillText(feats[i].l, cx, statsY + valFont * 1.15 + lblFont * 1.5);
    if (i < feats.length - 1) {
      ctx.strokeStyle = "#E2E2E2"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad + (i + 1) * cellW, photoH + infoH * 0.07);
      ctx.lineTo(pad + (i + 1) * cellW, photoH + infoH * 0.52);
      ctx.stroke();
    }
  }

  // Separator
  ctx.strokeStyle = "#EEEEEE"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, photoH + infoH * 0.57); ctx.lineTo(W - pad, photoH + infoH * 0.57); ctx.stroke();

  // Contact zone
  const zoneY = photoH + infoH * 0.60;
  const zoneH = infoH * 0.36;
  const agentFont = Math.min(H * 0.025, zoneH * 0.32);
  const subFont2 = Math.min(H * 0.018, zoneH * 0.24);
  // Wider CTA button so text has breathing room
  const ctaBtnW = W * 0.33;
  const ctaBtnH = zoneH * 0.65;
  const ctaBtnX = W - pad - ctaBtnW;
  const ctaBtnY2 = zoneY + (zoneH - ctaBtnH) / 2;

  // Left: headshot avatar + agent + contact
  const avatarR2 = headshot ? zoneH * 0.38 : 0;
  const avatarCX2 = headshot ? pad + avatarR2 : 0;
  const textX2 = headshot ? avatarCX2 + avatarR2 + pad * 0.55 : pad;
  if (headshot) drawAvatar(ctx, headshot, avatarCX2, zoneY + zoneH * 0.5, avatarR2);

  const leftMaxW = ctaBtnX - textX2 - pad;
  ctx.textAlign = "left"; ctx.fillStyle = "#1A1A1A"; ctx.font = `bold ${agentFont}px Arial`;
  ctx.fillText(trunc(ctx, f.agent, leftMaxW), textX2, zoneY + zoneH * 0.34);
  ctx.fillStyle = "#888"; ctx.font = `${subFont2}px Arial`;
  ctx.fillText(trunc(ctx, `${f.phone}  •  ${f.website}`, leftMaxW), textX2, zoneY + zoneH * 0.34 + agentFont * 1.4);

  // Right: CTA button
  ctx.fillStyle = f.accent; pill(ctx, ctaBtnX, ctaBtnY2, ctaBtnW, ctaBtnH, 14);
  ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
  const ctaFont2 = Math.min(H * 0.026, ctaBtnW * 0.14);
  ctx.font = `bold ${ctaFont2}px Arial`;
  ctx.fillText(trunc(ctx, f.cta.toUpperCase(), ctaBtnW * 0.86), ctaBtnX + ctaBtnW / 2, ctaBtnY2 + ctaBtnH * 0.62);
}

// ─── Template: Listing Card ───────────────────────────────────────────────────

function renderListingCard(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, f: Form, W: number, H: number, headshot: HTMLImageElement | null = null) {
  const isStory = H > W;
  const pad = W * 0.055;
  const barH = H * (isStory ? 0.18 : 0.28);
  const photoH = H - barH;

  // Photo
  if (img) coverImg(ctx, img, 0, 0, W, photoH);
  else { ctx.fillStyle = "#C8D4E4"; ctx.fillRect(0, 0, W, photoH); }

  // Subtle vignette on photo edges
  const vg = ctx.createRadialGradient(W / 2, photoH / 2, photoH * 0.3, W / 2, photoH / 2, photoH * 0.85);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, photoH);

  // "For Sale" pill — top-left of photo
  const tagH = H * (isStory ? 0.04 : 0.055);
  const tagW = W * (isStory ? 0.26 : 0.22);
  const tagPad = pad * 0.85;
  ctx.fillStyle = f.accent; pill(ctx, tagPad, tagPad, tagW, tagH, tagH / 2);
  ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
  ctx.font = `bold ${tagH * 0.5}px Arial`;
  ctx.fillText("For Sale", tagPad + tagW / 2, tagPad + tagH * 0.67);

  // White bar
  ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, photoH, W, barH);
  // Accent stripe at top of bar
  ctx.fillStyle = f.accent; ctx.fillRect(0, photoH, W, 5);

  if (isStory) {
    // Story: stacked layout — avatar + agent left, CTA right, contact below
    const midY = photoH + barH * 0.42;
    const agentFont = Math.min(H * 0.024, barH * 0.18);
    const subFont = Math.min(H * 0.016, barH * 0.12);
    const avatarR = headshot ? agentFont * 1.1 : 0;
    const avatarCX = headshot ? pad + avatarR : 0;
    const textX = headshot ? avatarCX + avatarR + pad * 0.6 : pad;
    const ctaBtnH = agentFont * 1.6, ctaBtnW = W * 0.3;
    const ctaBtnX = W - pad - ctaBtnW;
    const textMaxW = ctaBtnX - textX - pad;

    if (headshot) drawAvatar(ctx, headshot, avatarCX, midY - agentFont * 0.1, avatarR);

    ctx.textAlign = "left"; ctx.fillStyle = "#1A1A1A"; ctx.font = `bold ${agentFont}px Arial`;
    ctx.fillText(trunc(ctx, f.agent, textMaxW), textX, midY);
    ctx.fillStyle = "#666"; ctx.font = `${subFont}px Arial`;
    ctx.fillText(trunc(ctx, f.tagline || f.website, textMaxW), textX, midY + agentFont * 1.35);

    const ctaBtnY = midY - agentFont * 0.8;
    ctx.fillStyle = f.accent; pill(ctx, ctaBtnX, ctaBtnY, ctaBtnW, ctaBtnH, 10);
    ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
    const ctaF = Math.min(agentFont * 0.7, ctaBtnW * 0.13);
    ctx.font = `bold ${ctaF}px Arial`;
    ctx.fillText(trunc(ctx, f.cta.toUpperCase(), ctaBtnW * 0.86), ctaBtnX + ctaBtnW / 2, ctaBtnY + ctaBtnH * 0.63);

    ctx.textAlign = "center"; ctx.fillStyle = "#999"; ctx.font = `${subFont * 0.9}px Arial`;
    ctx.fillText(trunc(ctx, `${f.phone}  •  ${f.website}`, W - pad * 2), W / 2, photoH + barH * 0.83);
  } else {
    // Post: two-column layout with optional avatar
    const barCenterY = photoH + barH / 2;
    const agentFont = Math.min(H * 0.026, barH * 0.2);
    const subFont = Math.min(H * 0.018, barH * 0.14);
    const avatarR = headshot ? barH * 0.3 : 0;
    const avatarCX = headshot ? pad + avatarR : 0;
    const textX = headshot ? avatarCX + avatarR + pad * 0.7 : pad;
    const ctaBtnW = W * 0.32, ctaBtnH = barH * 0.42;
    const ctaBtnX = W - pad - ctaBtnW, ctaBtnY = barCenterY - ctaBtnH / 2;
    const leftMaxW = ctaBtnX - textX - pad;

    if (headshot) drawAvatar(ctx, headshot, avatarCX, barCenterY, avatarR);

    ctx.textAlign = "left"; ctx.fillStyle = "#1A1A1A"; ctx.font = `bold ${agentFont}px Arial`;
    ctx.fillText(trunc(ctx, f.agent, leftMaxW), textX, barCenterY - agentFont * 0.2);
    ctx.fillStyle = "#555"; ctx.font = `${subFont}px Arial`;
    ctx.fillText(trunc(ctx, f.tagline || f.website, leftMaxW), textX, barCenterY - agentFont * 0.2 + agentFont * 1.35);
    ctx.fillStyle = "#999"; ctx.font = `${subFont * 0.88}px Arial`;
    ctx.fillText(trunc(ctx, f.phone, leftMaxW), textX, barCenterY - agentFont * 0.2 + agentFont * 1.35 + subFont * 1.4);

    ctx.fillStyle = f.accent; pill(ctx, ctaBtnX, ctaBtnY, ctaBtnW, ctaBtnH, 12);
    ctx.textAlign = "center"; ctx.fillStyle = "#FFF";
    const ctaF = Math.min(H * 0.02, ctaBtnW * 0.11);
    ctx.font = `bold ${ctaF}px Arial`;
    ctx.fillText(trunc(ctx, f.cta.toUpperCase(), ctaBtnW * 0.86), ctaBtnX + ctaBtnW / 2, ctaBtnY + ctaBtnH * 0.62);
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

function FormField({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF385C] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
      />
    </div>
  );
}

export default function SocialMediaPostGenerator() {
  const auth = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<HTMLImageElement[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [template] = useState<Template>("modern-split");
  const [format, setFormat] = useState<Format>("post");
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [headshot, setHeadshot] = useState<HTMLImageElement | null>(null);
  const [headshotUrl, setHeadshotUrl] = useState<string | null>(null);
  const [includeHeadshot, setIncludeHeadshot] = useState(true);
  const [freeRewritesLeft, setFreeRewritesLeft] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = SIZES[format];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = photos[activePhoto] ?? null;
    const activeHeadshot = includeHeadshot ? headshot : null;
    renderModernSplit(ctx, img, form, w, h, activeHeadshot);
  }, [photos, activePhoto, format, form, headshot, includeHeadshot]);

  useEffect(() => { render(); }, [render]);

  useEffect(() => {
    const fetchFreeRewritesLeft = async () => {
      if (!auth.user) {
        setFreeRewritesLeft(null);
        return;
      }

      try {
        const userDocRef = doc(db, "users", auth.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFreeRewritesLeft(userDoc.data()?.freeRewritesLeft ?? null);
        }
      } catch {
        // Keep the UI usable even if the credit fetch fails.
      }
    };

    fetchFreeRewritesLeft();
  }, [auth.user]);

  const addPhotos = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files)
        .slice(0, 5 - photos.length)
        .forEach((file) => {
          if (!file.type.startsWith("image/")) return;
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            const img = new Image();
            img.onload = () => {
              setPhotos((prev) => {
                const next = [...prev, img];
                if (prev.length === 0) setActivePhoto(0);
                return next;
              });
              setPhotoUrls((prev) => [...prev, src]);
            };
            img.src = src;
          };
          reader.readAsDataURL(file);
        });
    },
    [photos.length],
  );

  const removePhoto = (idx: number) => {
    setPhotos((p) => p.filter((_, i) => i !== idx));
    setPhotoUrls((p) => p.filter((_, i) => i !== idx));
    setActivePhoto((p) => Math.max(0, p >= idx ? p - 1 : p));
  };

  const addHeadshot = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => { setHeadshot(img); setHeadshotUrl(src); };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const set = (key: keyof Form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const updateFreeRewritesLeft = async () => {
    if (!auth.user) return;

    try {
      const userDocRef = doc(db, "users", auth.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) return;

      const newFreeRewritesLeft = userDoc.data().freeRewritesLeft - 1;
      await updateDoc(userDocRef, { freeRewritesLeft: newFreeRewritesLeft });
      setFreeRewritesLeft(newFreeRewritesLeft);
    } catch {
      // Download already succeeded; fail silently rather than blocking the user.
    }
  };

  const handleCheckout = async () => {
    if (!auth.user) {
      toast.error("Please sign up to buy credits.", { icon: "🔐" });
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.user.uid,
          email: auth.user.email,
          purchaseType: "onetime",
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) return;

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
    setCheckoutLoading(false);
  };

  const handleDownloadClick = () => {
    if (!auth.user) {
      toast.error("Please sign up to download your social media post.", { icon: "🔐" });
      return;
    }

    if (!freeRewritesLeft || freeRewritesLeft <= 0) {
      handleCheckout();
      return;
    }

    download();
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `property-${format}.png`;
    a.click();
    void updateFreeRewritesLeft();
  };

  return (
    <>
      <Toaster />
      <ToolPageShell
        titleBefore="Social Media"
        titleAccent="Post Generator"
        subtitle="Generate social media posts for any social media platform. Upload photos, fill in the details, pick a template, and download a polished post for any social media platform."
      >
        <div className="mx-auto flex w-full max-w-8xl flex-col gap-6 lg:flex-row lg:items-start">
          {/* ── Canvas preview ── */}
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/tools" className="text-sm font-semibold text-[#E31C5F] hover:underline">
                ← Back to tools
              </Link>
            </div>

            <div
              className={`mx-auto overflow-hidden rounded-2xl border border-gray-200 shadow-lg ${format === "story" ? "max-w-[320px]" : "max-w-2xl"}`}
            >
              <canvas
                ref={canvasRef}
                className="block h-auto w-full"
              />
            </div>

            {photoUrls.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                {photoUrls.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${i === activePhoto ? "border-[#FF385C]" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5"
                    >
                      <X className="h-2.5 w-2.5 text-white" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Controls sidebar ── */}
          <aside className="w-full shrink-0 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:max-w-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Create your post</h2>
                <p className="text-xs text-gray-500">Credits are used when you download.</p>
              </div>
              <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
            </div>

            {/* 1. Photos */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">1. Photos</h3>
              <label
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-5 text-center transition-colors hover:border-[#FF385C]/40"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
              >
                <ImagePlus className="h-7 w-7 text-gray-400" />
                <p className="text-xs text-gray-500">Drag & drop or click — up to 5 photos</p>
                <span className="text-xs font-semibold text-[#E31C5F]">Browse files</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
              </label>
              {photoUrls.length === 1 && (
                <div className="mt-2 flex gap-2">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrls[0]} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removePhoto(0)} className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5">
                      <X className="h-2.5 w-2.5 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Template + Format */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">2. Template & Format</h3>
              <div className="mb-3 rounded-lg border-2 border-[#FF385C] bg-[#fff5f7] p-2.5 text-left text-xs font-semibold text-[#E31C5F]">
                Modern Split
                <span className="mt-0.5 block text-[10px] font-normal opacity-60">Navy + photo side by side</span>
              </div>
              <div className="flex gap-2">
                {(["post", "story"] as Format[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-colors ${format === fmt ? "border-[#FF385C] bg-[#fff5f7] text-[#E31C5F]" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                  >
                    {fmt === "post" ? "⬛ Post (1920)" : "▬ Story (9:16 HD)"}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Property Details */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-gray-900">3. Property Details</h3>
              <FormField label="Headline" value={form.headline} onChange={set("headline")} />
              <FormField label="Tagline" value={form.tagline} onChange={set("tagline")} placeholder="optional subtitle" />
              <FormField label="Price" value={form.price} onChange={set("price")} />
              <div className="grid grid-cols-3 gap-2">
                <FormField label="Beds" value={form.beds} onChange={set("beds")} />
                <FormField label="Baths" value={form.baths} onChange={set("baths")} />
                <FormField label="Area" value={form.area} onChange={set("area")} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Feature 1" value={form.extra1} onChange={set("extra1")} placeholder="e.g. Pool" />
                <FormField label="Feature 2" value={form.extra2} onChange={set("extra2")} placeholder="e.g. Garage" />
              </div>
            </div>

            {/* 4. Branding */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-gray-900">4. Branding</h3>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Photo</label>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-center text-xs text-gray-500 transition-colors hover:border-[#FF385C]/40">
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-[#E31C5F]">Upload photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => addHeadshot(e.target.files)} />
                  </label>
                  {headshotUrl && (
                    <div className="relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={headshotUrl} alt="" className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover" />
                      <button
                        type="button"
                        onClick={() => { setHeadshot(null); setHeadshotUrl(null); }}
                        className="absolute -right-1 -top-1 rounded-full bg-black/60 p-0.5"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  )}
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={includeHeadshot}
                    onChange={(e) => setIncludeHeadshot(e.target.checked)}
                    className="h-4 w-4 accent-[#FF385C]"
                  />
                  Include photo
                </label>
              </div>
              <FormField label="Name" value={form.agent} onChange={set("agent")} />
              <FormField label="Title" value={form.title} onChange={set("title")} placeholder="e.g. Licensed Realtor" />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Phone" value={form.phone} onChange={set("phone")} />
                <FormField label="Email" value={form.email} onChange={set("email")} placeholder="name@email.com" />
              </div>
              <FormField label="Website" value={form.website} onChange={set("website")} />
              <FormField label="CTA button" value={form.cta} onChange={set("cta")} placeholder="Contact Us" />
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Accent Color</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENTS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() => set("accent")(c)}
                      className={`h-7 w-7 rounded-full border-2 transition-transform ${form.accent === c ? "scale-110 border-gray-800" : "border-transparent hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <label className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-[10px] text-gray-400" title="Custom color">
                    +
                    <input type="color" className="sr-only" value={form.accent} onChange={(e) => set("accent")(e.target.value)} />
                  </label>
                </div>
              </div>
            </div>

            {/* Download */}
            {auth.user ? (
              freeRewritesLeft && freeRewritesLeft > 0 ? (
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF385C] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31C5F]"
                >
                  <Download className="h-5 w-5" />
                  Download PNG
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF385C] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31C5F] disabled:opacity-60"
                >
                  <Download className="h-5 w-5" />
                  {checkoutLoading ? "Loading..." : "Buy Credits"}
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={handleDownloadClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF385C] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31C5F]"
              >
                <Download className="h-5 w-5" />
                Download PNG
              </button>
            )}
          </aside>
        </div>
      </ToolPageShell>

      <RelatedToolsCards currentTool="social-media-post" />
    </>
  );
}
