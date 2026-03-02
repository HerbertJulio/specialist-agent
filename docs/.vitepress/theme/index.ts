import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidZoom from './MermaidZoom.vue'
import HomePlatforms from './HomePlatforms.vue'
import HomeHowItWorks from './HomeHowItWorks.vue'
import HomeFrameworks from './HomeFrameworks.vue'
import HomeSponsors from './HomeSponsors.vue'
import HeroAnimation from './HeroAnimation.vue'
import './custom.css'

const Layout = () =>
  h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h(HeroAnimation),
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
      // Intercept built-in locale switcher links to open in a new tab
      document.addEventListener(
        'click',
        (e) => {
          const link = (e.target as HTMLElement).closest(
            '.VPNavBarTranslations a, .VPNavScreenTranslations a, .VPNavBarExtra .translations a',
          )
          if (link) {
            e.preventDefault()
            e.stopPropagation()
            const href = link.getAttribute('href')
            if (href) window.open(href, '_blank', 'noopener')
          }
        },
        true,
      )
    }
  },
}
