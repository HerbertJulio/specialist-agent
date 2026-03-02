<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

const { site, lang, page } = useData()
const open = ref(false)

const locales = computed(() => {
  const entries = Object.entries(site.value.locales || {})
  return entries.map(([key, locale]) => ({
    key,
    label: locale.label || key,
    lang: locale.lang || 'en',
    active: lang.value === (locale.lang || 'en'),
  }))
})

function getTargetHref(localeKey: string): string {
  const currentPath = page.value.relativePath.replace(/\.md$/, '')
  const currentLocale = locales.value.find(l => l.active)

  let pagePath = currentPath
  if (currentLocale && currentLocale.key !== 'root') {
    pagePath = pagePath.replace(new RegExp(`^${currentLocale.key}/`), '')
  }

  const base = site.value.base || '/'
  if (localeKey === 'root') {
    return `${base}${pagePath}`
  }
  return `${base}${localeKey}/${pagePath}`
}

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}
</script>

<template>
  <div v-if="locales.length > 1" class="VPLanguageSwitcher" @mouseleave="close">
    <button class="trigger" :aria-expanded="open" aria-haspopup="true" @click="toggle">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <div v-show="open" class="menu">
      <div class="menu-group">
        <p class="menu-group-title">Languages</p>
        <a
          v-for="locale in locales"
          :key="locale.key"
          :href="getTargetHref(locale.key)"
          target="_blank"
          rel="noopener"
          class="menu-link"
          :class="{ active: locale.active }"
          @click="close"
        >
          {{ locale.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPLanguageSwitcher {
  position: relative;
  display: flex;
  align-items: center;
}

.trigger {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 12px;
  height: var(--vp-nav-height, 64px);
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.25s;
}

.trigger:hover {
  color: var(--vp-c-text-1);
}

.chevron {
  transition: transform 0.25s;
}

[aria-expanded="true"] .chevron {
  transform: rotate(180deg);
}

.menu {
  position: absolute;
  top: calc(var(--vp-nav-height, 64px) - 4px);
  right: 0;
  min-width: 148px;
  padding: 12px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  z-index: 100;
  animation: flyout-enter 0.2s ease-out;
}

@keyframes flyout-enter {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-group-title {
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  line-height: 32px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-link {
  display: block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  line-height: 28px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s;
}

.menu-link:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}

.menu-link.active {
  color: var(--vp-c-brand-1);
}
</style>
