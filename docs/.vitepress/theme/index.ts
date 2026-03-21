import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidZoom from './MermaidZoom.vue'
import HomePlatforms from './HomePlatforms.vue'
import HomeHowItWorks from './HomeHowItWorks.vue'
import HomeFrameworks from './HomeFrameworks.vue'
import HomeSponsors from './HomeSponsors.vue'
import HeroAnimation from './HeroAnimation.vue'
import HomeFeaturesDemo from './HomeFeaturesDemo.vue'
import CatalogGrid from './CatalogGrid.vue'
import CatalogV1 from './catalog/CatalogV1.vue'
import CatalogV2 from './catalog/CatalogV2.vue'
import CatalogV3 from './catalog/CatalogV3.vue'
import CatalogV4 from './catalog/CatalogV4.vue'
import CatalogV5 from './catalog/CatalogV5.vue'
import CatalogV6 from './catalog/CatalogV6.vue'
import CatalogV7 from './catalog/CatalogV7.vue'
import CatalogV8 from './catalog/CatalogV8.vue'
import CatalogV9 from './catalog/CatalogV9.vue'
import CatalogV10 from './catalog/CatalogV10.vue'
import './custom.css'

const Layout = () =>
  h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h(HeroAnimation),
    'home-features-after': () => [
      h(HomeFeaturesDemo),
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
  enhanceApp({ app }: { app: any }) {
    app.component('CatalogGrid', CatalogGrid)
    app.component('CatalogV1', CatalogV1)
    app.component('CatalogV2', CatalogV2)
    app.component('CatalogV3', CatalogV3)
    app.component('CatalogV4', CatalogV4)
    app.component('CatalogV5', CatalogV5)
    app.component('CatalogV6', CatalogV6)
    app.component('CatalogV7', CatalogV7)
    app.component('CatalogV8', CatalogV8)
    app.component('CatalogV9', CatalogV9)
    app.component('CatalogV10', CatalogV10)
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
