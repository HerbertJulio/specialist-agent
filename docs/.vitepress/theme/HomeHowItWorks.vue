<template>
  <section class="home-section">
    <h2 class="home-section-title">How It Works</h2>
    <p class="home-section-subtitle">Describe your intent. The right agent handles the rest.</p>
    <div class="steps-grid">
      <div class="step">
        <div class="step-number">1</div>
        <h3 class="step-title">Describe</h3>
        <p class="step-desc">Tell the agent what you need in plain language.</p>
        <code class="step-code">"Create a products module with CRUD"</code>
      </div>
      <div class="step-connector">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3 class="step-title">Agent Handles It</h3>
        <p class="step-desc">The specialized agent scaffolds types, service, components, and tests.</p>
        <code class="step-code">@builder → 6 files created</code>
      </div>
      <div class="step-connector">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3 class="step-title">Verified Code</h3>
        <p class="step-desc">Every claim is backed by actual test/build output. No "should work".</p>
        <code class="step-code">✅ 14/14 tests passing</code>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .steps-grid {
    flex-direction: row;
    gap: 0;
  }
}

.step {
  flex: 1;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.step-number {
  width: 36px;
  height: 36px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--as-bronze, #CD7F32));
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.step-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  line-height: 1.5;
}

.step-code {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-brand-1);
}

.step-connector {
  display: none;
  color: var(--vp-c-text-3);
  padding: 0 8px;
}

@media (min-width: 768px) {
  .step-connector {
    display: flex;
    align-items: center;
  }
}
</style>
