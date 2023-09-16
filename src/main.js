import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause, faStop, faBackward, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)

library.add(faPlay)
library.add(faPause)
library.add(faStop)
library.add(faBackward)
library.add(faArrowsRotate)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')