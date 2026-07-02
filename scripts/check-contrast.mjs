#!/usr/bin/env node
/**
 * 对比度回归脚本（无依赖，node scripts/check-contrast.mjs 直接运行）
 * 硬编码本项目关键前景/背景组合，按 WCAG 2.x 相对亮度公式计算对比度。
 * 正文字号目标：≥ 4.5:1。任何一组 FAIL 即退出码 1。
 *
 * 色值来源：
 *  - styles.css :root 变量区
 *  - app.js familyVisuals / categoryVisuals
 * 若修改上述色值，请同步更新本清单。
 */

const TARGET = 4.5;

// ---------- 基础色 ----------
const PAGE_BG = "#f7f9f8";                    // --bg
const SURFACE = { rgb: "#ffffff", a: 0.88 };  // --surface
const INK = "#202427";                        // --ink
const MUTED = "#5b625f";                      // --muted

// familyVisuals（app.js）
const FAMILIES = {
  "乐家": { color: "#7fa08f", text: "#496f5f", washA: 0.18 },
  "祺家": { color: "#8fa0bd", text: "#566a8a", washA: 0.18 },
  "旦家": { color: "#c89a9a", text: "#8a5d5d", washA: 0.17 },
};

// categoryVisuals（app.js）
const CATEGORIES = {
  "交通": { bg: "#d9e8e2", text: "#486d62" },
  "住宿": { bg: "#dfe5f2", text: "#536782" },
  "餐饮": { bg: "#f1dfce", text: "#7a5b3f" },
  "门票": { bg: "#eadff0", text: "#69587b" },
  "购物": { bg: "#eddcdf", text: "#7b565c" },
  "其他": { bg: "#e5e2d8", text: "#696252" },
};

// ---------- 颜色工具 ----------
const hex = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};

// src(alpha) 叠在不透明 dst 上
const over = (srcRgb, a, dstRgb) =>
  srcRgb.map((c, i) => c * a + dstRgb[i] * (1 - a));

// color-mix(in srgb, A p%, B) 的近似（srgb 线性插值）
const mix = (aRgb, p, bRgb) =>
  aRgb.map((c, i) => c * p + bRgb[i] * (1 - p));

const luminance = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (fg, bg) => {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
};

// 卡片实际底色：--surface 叠在页面底色上（≈ 近白）
const CARD_BG = over(hex(SURFACE.rgb), SURFACE.a, hex(PAGE_BG));

// ---------- 组合清单 ----------
const checks = [];

// 1) 三家选中态：白字 on 深文字色填充（渐变浅端 = color-mix(text 92%, white)）
for (const [name, f] of Object.entries(FAMILIES)) {
  const dark = hex(f.text);
  const lightEnd = mix(dark, 0.92, hex("#ffffff"));
  checks.push([`家庭选中态白字 · ${name}（渐变深端）`, hex("#ffffff"), dark]);
  checks.push([`家庭选中态白字 · ${name}（渐变浅端）`, hex("#ffffff"), lightEnd]);
}

// 2) 三家 wash 底上的深文字
for (const [name, f] of Object.entries(FAMILIES)) {
  const washBg = over(hex(f.color), f.washA, CARD_BG);
  checks.push([`家庭深文字 on wash · ${name}`, hex(f.text), washBg]);
}

// 3) 类别六色 文字/底色
for (const [name, c] of Object.entries(CATEGORIES)) {
  checks.push([`类别文字 · ${name}`, hex(c.text), hex(c.bg)]);
}

// 4) --muted 于卡片底
checks.push(["--muted on 卡片底", hex(MUTED), CARD_BG]);

// 5) 总支出标签 rgba(37,48,45,0.72) on 三色渐变（分别按三段底色合成）
const totalStops = [
  ["乐家段", "#a9ceb5", 0.56],
  ["祺家段", "#b9c9e6", 0.56],
  ["旦家段", "#efc2bf", 0.54],
];
for (const [seg, color, a] of totalStops) {
  const segBg = over(hex(color), a, CARD_BG);
  const label = over(hex("#25302d"), 0.72, segBg);
  checks.push([`总支出标签 · ${seg}`, label, segBg]);
}

// 6) 总支出数字（--total-text-color 不透明）on 三色渐变
for (const [seg, color, a] of totalStops) {
  const segBg = over(hex(color), a, CARD_BG);
  checks.push([`总支出数字 · ${seg}`, hex("#25302d"), segBg]);
}

// 7) 正文 --ink 于卡片底（基线守护）
checks.push(["--ink on 卡片底", hex(INK), CARD_BG]);

// ---------- 输出 ----------
let failed = 0;
const pad = (s, n) => s + " ".repeat(Math.max(0, n - [...s].reduce((w, ch) => w + (ch.charCodeAt(0) > 255 ? 2 : 1), 0)));
console.log(pad("组合", 40) + pad("对比度", 10) + "结果");
console.log("-".repeat(58));
for (const [name, fg, bg] of checks) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= TARGET;
  if (!ok) failed++;
  console.log(pad(name, 40) + pad(ratio.toFixed(2) + ":1", 10) + (ok ? "PASS" : "FAIL"));
}
console.log("-".repeat(58));
console.log(failed === 0 ? `全部 ${checks.length} 组 PASS（目标 ≥ ${TARGET}:1）` : `${failed} 组 FAIL`);
process.exit(failed === 0 ? 0 : 1);
