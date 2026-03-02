<template>
  <section class="home-section">
    <h2 class="home-section-title">{{ isPtBR ? 'Ecossistema' : 'Ecosystem' }}</h2>
    <p class="home-section-subtitle">{{ isPtBR ? 'Frameworks, agentes, skills e hooks trabalhando juntos.' : 'Frameworks, agents, skills, and hooks working together.' }}</p>

    <div class="cloud-stage">
      <!-- Layer 1 - deep background: small, blurred, slow, scrolls right -->
      <div class="marquee-lane lane-back">
        <div class="marquee-inner reverse">
          <div
            v-for="item in backRow"
            :key="item.key"
            class="cloud-card"
            :class="'card-' + item.type"
          >
            <span v-if="item.icon" class="card-icon" v-html="item.icon" />
            <span class="card-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Layer 2 - mid: medium size, slight blur, scrolls left -->
      <div class="marquee-lane lane-mid">
        <div class="marquee-inner forward">
          <div
            v-for="item in midRow"
            :key="item.key"
            class="cloud-card"
            :class="'card-' + item.type"
          >
            <span v-if="item.icon" class="card-icon" v-html="item.icon" />
            <span class="card-label">{{ item.label }}</span>
            <span v-if="item.sub" class="card-sub">{{ item.sub }}</span>
          </div>
        </div>
      </div>

      <!-- Layer 3 - foreground: full size, crisp, fast, scrolls right -->
      <div class="marquee-lane lane-front">
        <div class="marquee-inner reverse-fast">
          <div
            v-for="item in frontRow"
            :key="item.key"
            class="cloud-card"
            :class="'card-' + item.type"
          >
            <span v-if="item.icon" class="card-icon" v-html="item.icon" />
            <span class="card-label">{{ item.label }}</span>
            <span v-if="item.sub" class="card-sub">{{ item.sub }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')

// Official SVG logos from Simple Icons (https://simpleicons.org)
const logos: Record<string, string> = {
  nextjs: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"/></svg>',
  react: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>',
  vue: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>',
  svelte: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.109 4.109 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.286-.21a7.204 7.204 0 0 0-2.187-1.093l-.208-.063.02-.207a1.255 1.255 0 0 0-.226-.831 1.337 1.337 0 0 0-1.435-.532 1.231 1.231 0 0 0-.343.15L8.62 9.368a1.162 1.162 0 0 0-.524.778 1.24 1.24 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.235 1.235 0 0 0 .344-.151l2.132-1.36a4.067 4.067 0 0 1 1.135-.498 4.44 4.44 0 0 1 4.765 1.766 4.108 4.108 0 0 1 .702 3.108 3.857 3.857 0 0 1-1.742 2.583l-5.589 3.562a4.072 4.072 0 0 1-1.135.499m10.358-17.95C18.484-.015 14.082-.96 10.9 1.068L5.31 4.63a6.412 6.412 0 0 0-2.896 4.295 6.753 6.753 0 0 0 .666 4.336 6.43 6.43 0 0 0-.96 2.396 6.833 6.833 0 0 0 1.168 5.167c2.229 3.19 6.63 4.135 9.812 2.108l5.59-3.562a6.41 6.41 0 0 0 2.896-4.295 6.756 6.756 0 0 0-.665-4.336 6.429 6.429 0 0 0 .958-2.396 6.831 6.831 0 0 0-1.167-5.168Z"/></svg>',
  angular: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16.712 17.711H7.288l-1.204 2.916L12 24l5.916-3.373-1.204-2.916ZM14.692 0l7.832 16.855.814-12.856L14.692 0ZM9.308 0 .662 3.999l.814 12.856L9.308 0Zm-.405 13.93h6.198L12 6.396 8.903 13.93Z"/></svg>',
  astro: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z"/></svg>',
  nuxt: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M13.4642 19.8295h8.9218c.2834 0 .5618-.0723.8072-.2098a1.5899 1.5899 0 0 0 .5908-.5732 1.5293 1.5293 0 0 0 .216-.783 1.529 1.529 0 0 0-.2167-.7828L17.7916 7.4142a1.5904 1.5904 0 0 0-.5907-.573 1.6524 1.6524 0 0 0-.807-.2099c-.2833 0-.5616.0724-.807.2098a1.5904 1.5904 0 0 0-.5907.5731L13.4642 9.99l-2.9954-5.0366a1.5913 1.5913 0 0 0-.591-.573 1.6533 1.6533 0 0 0-.8071-.2098c-.2834 0-.5617.0723-.8072.2097a1.5913 1.5913 0 0 0-.591.573L.2168 17.4808A1.5292 1.5292 0 0 0 0 18.2635c-.0001.2749.0744.545.216.783a1.59 1.59 0 0 0 .5908.5732c.2454.1375.5238.2098.8072.2098h5.6003c2.219 0 3.8554-.9454 4.9813-2.7899l2.7337-4.5922L16.3935 9.99l4.3944 7.382h-5.8586ZM7.123 17.3694l-3.9083-.0009 5.8586-9.8421 2.9232 4.921-1.9572 3.2892c-.7478 1.1967-1.5972 1.6328-2.9163 1.6328z"/></svg>',
}

interface Item {
  label: string
  type: 'framework' | 'agent' | 'skill' | 'hook'
  color: string
  sub?: string
  icon?: string
}

const allItems: Item[] = [
  { label: 'Next.js', type: 'framework', color: '#999', sub: 'App Router', icon: logos.nextjs },
  { label: 'React', type: 'framework', color: '#61DAFB', sub: 'Hooks, Zustand', icon: logos.react },
  { label: 'Vue 3', type: 'framework', color: '#42b883', sub: 'Composition API', icon: logos.vue },
  { label: 'SvelteKit', type: 'framework', color: '#FF3E00', sub: 'Stores, SSR', icon: logos.svelte },
  { label: 'Angular', type: 'framework', color: '#DD0031', sub: 'Signals', icon: logos.angular },
  { label: 'Astro', type: 'framework', color: '#FF5D01', sub: 'Islands', icon: logos.astro },
  { label: 'Nuxt', type: 'framework', color: '#00DC82', sub: 'Auto-imports', icon: logos.nuxt },
  { label: '@builder', type: 'agent', color: '#4A7FCF' },
  { label: '@reviewer', type: 'agent', color: '#4A7FCF' },
  { label: '@doctor', type: 'agent', color: '#4A7FCF' },
  { label: '@planner', type: 'agent', color: '#4A7FCF' },
  { label: '@security', type: 'agent', color: '#4A7FCF' },
  { label: '@architect', type: 'agent', color: '#4A7FCF' },
  { label: '@tdd', type: 'agent', color: '#4A7FCF' },
  { label: '@migrator', type: 'agent', color: '#4A7FCF' },
  { label: '@executor', type: 'agent', color: '#4A7FCF' },
  { label: '@pair', type: 'agent', color: '#4A7FCF' },
  { label: '/plan', type: 'skill', color: '#CD7F32' },
  { label: '/debug', type: 'skill', color: '#CD7F32' },
  { label: '/commit', type: 'skill', color: '#CD7F32' },
  { label: '/audit', type: 'skill', color: '#CD7F32' },
  { label: '/verify', type: 'skill', color: '#CD7F32' },
  { label: '/tdd', type: 'skill', color: '#CD7F32' },
  { label: '/onboard', type: 'skill', color: '#CD7F32' },
  { label: '/health', type: 'skill', color: '#CD7F32' },
  { label: 'session-start', type: 'hook', color: '#8B5CF6' },
  { label: 'before-plan', type: 'hook', color: '#8B5CF6' },
  { label: 'after-task', type: 'hook', color: '#8B5CF6' },
  { label: 'on-error', type: 'hook', color: '#8B5CF6' },
  { label: 'before-review', type: 'hook', color: '#8B5CF6' },
]

// Distribute items across 3 rows and duplicate for seamless loop
function makeRow(indices: number[], suffix: string) {
  const picked = indices.map(i => allItems[i])
  // Duplicate for seamless loop (translateX -50% technique)
  return [
    ...picked.map((item, i) => ({ ...item, key: `${suffix}-a-${i}` })),
    ...picked.map((item, i) => ({ ...item, key: `${suffix}-b-${i}` })),
  ]
}

// Back row: agents + hooks (background elements)
const backRow = computed(() => makeRow([8, 25, 10, 27, 13, 26, 15, 28, 9, 29], 'back'))

// Mid row: mix of everything
const midRow = computed(() => makeRow([0, 11, 17, 3, 14, 19, 5, 12, 21, 6], 'mid'))

// Front row: frameworks + popular skills
const frontRow = computed(() => makeRow([1, 18, 2, 20, 4, 22, 7, 23, 16, 24], 'front'))
</script>

<style scoped>
.cloud-stage {
  position: relative;
  height: 120px;
  overflow: hidden;
  mask-image:
    linear-gradient(180deg, transparent 0%, #000 6%, #000 94%, transparent 100%),
    linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
  mask-composite: intersect;
  -webkit-mask-image:
    linear-gradient(180deg, transparent 0%, #000 6%, #000 94%, transparent 100%),
    linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
  -webkit-mask-composite: source-in;
  pointer-events: none;
}

/* Each lane is a horizontal strip, overlapping via negative margins */
.marquee-lane {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.marquee-inner {
  display: flex;
  gap: 14px;
  width: max-content;
  padding: 6px 0;
}

/* --- Directions & speeds --- */
.forward {
  animation: scroll-left 45s linear infinite;
}

.reverse {
  animation: scroll-right 55s linear infinite;
}

.reverse-fast {
  animation: scroll-right 35s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* --- Layer depth --- */
.lane-back {
  position: relative;
  z-index: 1;
  margin-bottom: -30px;
}

.lane-back .cloud-card {
  transform: scale(0.72);
  opacity: 0.25;
  filter: blur(1.5px);
}

.lane-mid {
  position: relative;
  z-index: 2;
  margin-bottom: -26px;
}

.lane-mid .cloud-card {
  transform: scale(0.88);
  opacity: 0.55;
  filter: blur(0.5px);
}

.lane-front {
  position: relative;
  z-index: 3;
}

.lane-front .cloud-card {
  transform: scale(1);
  opacity: 0.92;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.dark .lane-front .cloud-card {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* --- Card base --- */
.cloud-card {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  white-space: nowrap;
}

/* Type-specific styles */
.card-framework {
  border: 1px solid var(--vp-c-divider);
}

.card-agent {
  border: 1px solid rgba(74, 127, 207, 0.25);
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, rgba(74, 127, 207, 0.04) 100%);
}

.card-skill {
  border: 1px solid rgba(205, 127, 50, 0.25);
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, rgba(205, 127, 50, 0.04) 100%);
}

.card-hook {
  border: 1px solid rgba(139, 92, 246, 0.25);
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, rgba(139, 92, 246, 0.04) 100%);
}

.card-icon {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
}

.card-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-agent .card-label { color: #4A7FCF; }
.card-skill .card-label { color: #CD7F32; }
.card-hook .card-label { color: #8B5CF6; }

.dark .card-agent .card-label { color: #6DA7F0; }
.dark .card-skill .card-label { color: #D4943F; }
.dark .card-hook .card-label { color: #A78BFA; }

.card-sub {
  font-size: 11px;
  color: var(--vp-c-text-3);
  padding-left: 6px;
  border-left: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .cloud-stage {
    height: 120px;
  }
  .lane-back { margin-bottom: -24px; }
  .lane-mid { margin-bottom: -20px; }
}

@media (prefers-reduced-motion: reduce) {
  .forward,
  .reverse,
  .reverse-fast {
    animation: none;
  }
  .marquee-inner {
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
  }
  .cloud-stage {
    height: auto;
    mask-image: none;
    -webkit-mask-image: none;
    pointer-events: auto;
  }
  .lane-back,
  .lane-mid {
    margin-bottom: 8px;
  }
  .lane-back .cloud-card,
  .lane-mid .cloud-card {
    transform: none;
    opacity: 0.8;
    filter: none;
  }
}
</style>
