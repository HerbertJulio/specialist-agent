<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

const { site, lang } = useData()
const isOpen = ref(false)

const locales = computed(() => {
  const entries = Object.entries(site.value.locales || {})
  return entries.map(([key, locale]) => {
    const prefix = key === 'root' ? '/' : `/${key}/`
    return {
      label: locale.label || key,
      code: (locale.lang || 'en').split('-')[0].toUpperCase(),
      link: prefix,
      active: lang.value === (locale.lang || 'en'),
    }
  })
})

const currentLocale = computed(() => locales.value.find(l => l.active))

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <div v-if="locales.length > 1" class="lang-switcher" @mouseleave="close">
    <button class="lang-toggle" :aria-label="`Language: ${currentLocale?.label}`" @click="toggle">
      <span class="lang-code">{{ currentLocale?.code }}</span>
      <svg class="lang-chevron" :class="{ open: isOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div v-show="isOpen" class="lang-menu">
      <a
        v-for="locale in locales"
        :key="locale.code"
        class="lang-option"
        :class="{ active: locale.active }"
        :href="locale.link"
      >
        <span class="lang-option-code">{{ locale.code }}</span>
        <span class="lang-option-label">{{ locale.label }}</span>
        <svg v-if="locale.active" class="lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.lang-switcher {
  position: relative;
  display: none;
}

/* Only show on desktop — mobile already works fine */
@media (min-width: 768px) {
  .lang-switcher {
    display: block;
    margin-left: 8px;
  }
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  line-height: 1;
}

.lang-toggle:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.lang-code {
  letter-spacing: 0.5px;
}

.lang-chevron {
  transition: transform 0.2s ease;
}

.lang-chevron.open {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 160px;
  padding: 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
}

.dark .lang-menu {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
}

.lang-option:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.lang-option.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.lang-option-code {
  font-weight: 700;
  font-size: 12px;
  min-width: 24px;
  text-align: center;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}

.lang-option.active .lang-option-code {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.lang-check {
  margin-left: auto;
  color: var(--vp-c-brand-1);
}
</style>
