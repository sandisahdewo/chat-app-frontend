import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import router from './router'
import vuetify from './plugins/vuetify'
import vueDebounce from 'vue-debounce'
import store from './store/index'
import VueChatScroll from 'vue-chat-scroll'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
}))

Vue.use(require('vue-moment'))

Vue.use(vueDebounce, {
  listenTo: ['input', 'keyup'],
})

Vue.use(VueChatScroll)

new Vue({
  router,
  store,

  created() {
    // const user = JSON.parse(localStorage.getItem('user'))

    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      this.$socket.emit('setLastOnline', )
    });

    window.addEventListener('focus', () => {
      this.$socket.emit('setLastOnline', 'on stay here')
    })

    window.addEventListener('blur', () => {
      this.$socket.emit('setLastOnline', 'on blur')
    })
  },

  vuetify,
  render: h => h(App)
}).$mount('#app')
