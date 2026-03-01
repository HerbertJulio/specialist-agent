import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidZoom from './MermaidZoom.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(MermaidZoom),
      'nav-bar-content-after': () => h(LanguageSwitcher),
    })
  },
}
