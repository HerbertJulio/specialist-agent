---
title: Animation Preview
layout: page
---

<style>
.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 900px;
  margin: 40px auto;
}

@media (max-width: 640px) {
  .preview-grid {
    grid-template-columns: 1fr;
  }
}

.preview-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  background: var(--vp-c-bg-soft);
}

.preview-card h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.preview-card p {
  margin: 0 0 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.preview-logo {
  width: 140px;
  height: auto;
  margin: 0 auto;
  display: block;
}

.preview-card-wide {
  grid-column: 1 / -1;
  border-color: var(--as-bronze, #CD7F32);
}
</style>

# Animation Preview

Escolha a animacao para o hero logo.

<div class="preview-grid">

<div class="preview-card">
  <h3>A) Float + Pulse</h3>
  <p>Flutua e cresce sutil, como respirando</p>
  <img src="/logo-hero.svg" class="preview-logo anim-breathe" />
</div>

<div class="preview-card">
  <h3>B) Rotacao 3D lenta</h3>
  <p>Gira suavemente no eixo Y</p>
  <img src="/logo-hero.svg" class="preview-logo anim-rotate3d" />
</div>

<div class="preview-card">
  <h3>C) Float + Rotate 3D</h3>
  <p>Flutua e gira lateralmente</p>
  <img src="/logo-hero.svg" class="preview-logo anim-float-rotate" />
</div>

<div class="preview-card">
  <h3>D) Pulse + Glow</h3>
  <p>Pulsa com sombra azul pulsante</p>
  <img src="/logo-hero.svg" class="preview-logo anim-pulse-glow" />
</div>

<div class="preview-card preview-card-wide">
  <h3>E) Vite-style 3D Isometric</h3>
  <p>Stack 3D isometrico com layers separadas + labels de agentes flutuando</p>
  <HeroAnimation />
</div>

</div>
