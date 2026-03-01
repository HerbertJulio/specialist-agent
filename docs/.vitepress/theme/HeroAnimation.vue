<script setup lang="ts">
</script>

<template>
  <div class="hero-anim-3d">
    <div class="ha-scene">
      <!-- Agent satellites -->
      <div class="ha-tag ha-tag-1"><span>@builder</span></div>
      <div class="ha-tag ha-tag-2"><span>@reviewer</span></div>
      <div class="ha-tag ha-tag-3"><span>@doctor</span></div>

      <!-- Connection lines (SVG overlay) -->
      <svg class="ha-lines" viewBox="0 0 300 300" fill="none">
        <line x1="72" y1="52" x2="110" y2="100" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
        <line x1="258" y1="175" x2="200" y2="155" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
        <line x1="68" y1="262" x2="120" y2="205" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
      </svg>

      <!-- 3D diamond stack -->
      <div class="ha-stack">
        <div class="ha-card ha-card-3"></div>
        <div class="ha-card ha-card-2"></div>
        <div class="ha-card ha-card-1">
          <div class="ha-card-highlight"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-anim-3d {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ha-scene {
  position: relative;
  width: 300px;
  height: 300px;
  perspective: 1200px;
  perspective-origin: 50% 35%;
}

/* ── 3D Stack ── */
.ha-stack {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg);
  animation: ha-stack-float 8s ease-in-out infinite;
}

.ha-card {
  position: absolute;
  width: 130px;
  height: 130px;
  left: -65px;
  top: -65px;
  border-radius: 16px;
  border: 1px solid rgba(74, 127, 207, 0.15);
  transition: transform 0.4s ease;
}

/* Bottom layer — midnight */
.ha-card-3 {
  background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%);
  opacity: 0.85;
  animation: ha-breathe-3 6s ease-in-out infinite;
}

/* Middle layer — royal blue */
.ha-card-2 {
  background: linear-gradient(135deg, #1E3A5F 0%, #2B5EA7 100%);
  opacity: 0.9;
  border-color: rgba(74, 127, 207, 0.2);
  animation: ha-breathe-2 6s ease-in-out infinite 0.2s;
}

/* Top layer — blue to bronze */
.ha-card-1 {
  background: linear-gradient(135deg, #4A7FCF 0%, #CD7F32 100%);
  opacity: 0.95;
  border-color: rgba(205, 127, 50, 0.25);
  box-shadow:
    0 0 30px rgba(74, 127, 207, 0.15),
    0 0 60px rgba(205, 127, 50, 0.08);
  animation: ha-breathe-1 6s ease-in-out infinite 0.4s;
  overflow: hidden;
}

/* Highlight on top layer (light reflection) */
.ha-card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  border-radius: 16px 0 0 16px;
}

.dark .ha-card-1 {
  box-shadow:
    0 0 40px rgba(74, 127, 207, 0.25),
    0 0 80px rgba(205, 127, 50, 0.12);
}

/* Layer breathing — spread apart and come back */
@keyframes ha-breathe-3 {
  0%, 100% { transform: translateZ(0); }
  50% { transform: translateZ(6px); }
}

@keyframes ha-breathe-2 {
  0%, 100% { transform: translateZ(28px); }
  50% { transform: translateZ(38px); }
}

@keyframes ha-breathe-1 {
  0%, 100% { transform: translateZ(56px); }
  50% { transform: translateZ(70px); }
}

/* Whole stack float */
@keyframes ha-stack-float {
  0%, 100% {
    transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg) translateY(-8px);
  }
}

/* ── Connection lines ── */
.ha-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: var(--vp-c-text-3);
}

/* ── Agent satellites ── */
.ha-tag {
  position: absolute;
  z-index: 10;
}

.ha-tag span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 11px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .ha-tag span {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.ha-tag-1 {
  top: 12%;
  left: 2%;
  animation: ha-tag-float 5s ease-in-out infinite;
}

.ha-tag-2 {
  top: 52%;
  right: 0;
  animation: ha-tag-float 5s ease-in-out infinite 1.7s;
}

.ha-tag-3 {
  bottom: 6%;
  left: 5%;
  animation: ha-tag-float 5s ease-in-out infinite 3.3s;
}

@keyframes ha-tag-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .ha-stack,
  .ha-card-3,
  .ha-card-2,
  .ha-card-1,
  .ha-tag {
    animation: none;
  }

  .ha-card-3 { transform: translateZ(0); }
  .ha-card-2 { transform: translateZ(28px); }
  .ha-card-1 { transform: translateZ(56px); }
}
</style>
