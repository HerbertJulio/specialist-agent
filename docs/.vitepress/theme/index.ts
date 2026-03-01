import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidZoom from './MermaidZoom.vue'
import HomePlatforms from './HomePlatforms.vue'
import HomeHowItWorks from './HomeHowItWorks.vue'
import HomeFrameworks from './HomeFrameworks.vue'
import HomeSponsors from './HomeSponsors.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => [
        h(HomePlatforms),
        h(HomeHowItWorks),
        h(HomeFrameworks),
        h(HomeSponsors),
      ],
      'layout-bottom': () => h(MermaidZoom),
    })
  },
}
