<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const dismissed = ref(false)

const show = computed(() => frontmatter.value.layout === 'home' && !dismissed.value)
</script>

<template>
  <div v-if="show" class="announcement-bar">
    <div class="announcement-content">
      <a href="/guide/installation">
        <span class="announcement-badge">New</span>
        v2.7 - Lite agents are now 80% cheaper. Framework packs for 7 stacks.
      </a>
    </div>
    <button class="announcement-dismiss" @click="dismissed = true" aria-label="Dismiss">&times;</button>
  </div>
</template>

<style scoped>
.announcement-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--as-royal, #1E3A5F), var(--as-midnight, #0A1628));
  color: var(--vp-c-text-dark-1, #fff);
  font-size: 13px;
  position: relative;
}

.announcement-content a {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.announcement-content a:hover {
  text-decoration: underline;
}

.announcement-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--as-bronze, #CD7F32);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.announcement-dismiss {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  padding: 4px 8px;
}

.announcement-dismiss:hover {
  opacity: 1;
}
</style>
