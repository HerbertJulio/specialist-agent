import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidZoom from './MermaidZoom.vue'
import HomePlatforms from './HomePlatforms.vue'
import HomeHowItWorks from './HomeHowItWorks.vue'
import HomeFrameworks from './HomeFrameworks.vue'
import HomeSponsors from './HomeSponsors.vue'
import HeroAnimation from './HeroAnimation.vue'
import HomeInstall from './HomeInstall.vue'
import './custom.css'

const Layout = () =>
  h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h(HeroAnimation),
    'home-hero-actions-after': () => h(HomeInstall),
    'home-features-after': () => [
      h(HomePlatforms),
      h(HomeHowItWorks),
      h(HomeFrameworks),
      h(HomeSponsors),
    ],
    'layout-bottom': () => h(MermaidZoom),
  })

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      // On mobile/tablet: navigate in same tab instead of opening new tab
      document.addEventListener(
        'click',
        (e) => {
          if (window.innerWidth >= 768) return

          const link = (e.target as HTMLElement).closest(
            '.VPNavScreenTranslations a',
          )
          if (link) {
            e.preventDefault()
            e.stopPropagation()
            const href = link.getAttribute('href')
            if (href) window.location.href = href
          }
        },
        true,
      )
    }
  },
}
