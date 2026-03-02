<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')
</script>

<template>
  <section class="home-section sponsors-section">
    <h2 class="home-section-title">{{ isPtBR ? 'Apoie o Projeto' : 'Support the Project' }}</h2>
    <p class="home-section-subtitle">
      <template v-if="isPtBR">
        Specialist Agent tem licença MIT e é gratuito para sempre.<br />
        Se ele economiza seu tempo, considere apoiar seu desenvolvimento.
      </template>
      <template v-else>
        Specialist Agent is MIT licensed and free forever.<br />
        If it saves you time, consider supporting its development.
      </template>
    </p>
    <div class="sponsor-actions">
      <a href="https://github.com/sponsors/HerbertJulio" target="_blank" rel="noopener" class="sponsor-button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.6 20.6 0 0 0 8 13.393a20.6 20.6 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"/>
        </svg>
        {{ isPtBR ? 'Seja um Sponsor' : 'Become a Sponsor' }}
      </a>
      <a href="https://github.com/HerbertJulio/specialist-agent" target="_blank" rel="noopener" class="github-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
        </svg>
        {{ isPtBR ? 'Star no GitHub' : 'Star on GitHub' }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.sponsor-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.sponsor-button,
.github-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s ease;
}

.sponsor-button {
  background: linear-gradient(135deg, #db61a2, #ea4aaa);
  color: #fff;
}

.sponsor-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(219, 97, 162, 0.4);
}

.github-button {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.github-button:hover {
  border-color: var(--vp-c-text-2);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.dark .github-button:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
</style>
