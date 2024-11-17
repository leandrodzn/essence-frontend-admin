// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#963d82',
          secondary: 'rgba(237, 230, 222, 0.67)'
        }
      },
      dark: {
        colors: {
          primary: '#963d82',
          secondary: 'rgba(237, 230, 222, 0.67)'
        }
      }
    }
  }
})

export default vuetify
