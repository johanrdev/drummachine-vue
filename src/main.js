import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)

library.add(faPlay)
library.add(faPause)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')