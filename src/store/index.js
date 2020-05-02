import Vue from 'vue'
import Vuex from 'vuex'
import contact from './contact'
import message from './message'
import autorization from './authorization'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    contact,
    message,
    autorization
  }
})