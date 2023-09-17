import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause, faStop, faBackward, faArrowsRotate, faShuffle, faArrowDownAZ, faArrowDownZA, faDrum, faMusic, faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
const pinia = createPinia()

library.add(faPlay)
library.add(faPause)
library.add(faStop)
library.add(faBackward)
library.add(faArrowsRotate)
library.add(faShuffle)
library.add(faArrowDownAZ)
library.add(faArrowDownZA)
library.add(faDrum)
library.add(faMusic)
library.add(faGear)

app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')