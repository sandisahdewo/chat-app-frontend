const message = {
  state: {
    messages: []
  },
  mutations: {
    storeMessages (state, messages) {
      state.messages = messages
    },
    pushMessage (state, message) {
      state.messages.push(message)
    }
  },
  actions: {
    storeMessages({ commit }, messages) {
      commit('storeMessages', messages)
    },
    pushMessage({ commit }, message) {
      commit('pushMessage', message)
    }
  },
  getters: {
    getMessages: state => {
      return state.messages
    }
  }
}

export default message;