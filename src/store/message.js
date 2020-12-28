const message = {
  state: {
    messages: [],
    message: '', // form new or edit message
    selectedMessage: {
      action: '',
      message: {}
    }
  },
  mutations: {
    storeMessages (state, messages) {
      state.messages = messages
    },
    pushMessage (state, message) {
      state.messages.push(message)
    },
    setMessage (state, message) {
      state.message = message
    },
    setSelectedMessage (state, data) {
      state.selectedMessage.action = data.action
      state.selectedMessage.message = data.selected
    }
  },
  actions: {
    storeMessages({ commit }, messages) {
      commit('storeMessages', messages)
    },
    pushMessage({ commit }, message) {
      commit('pushMessage', message)
    },
    setMessage({ commit }, message) {
      commit('setMessage', message)
    },
    unsetMessage({ commit }) {
      commit('setMessage', '')
    },
    setSelectedMessage({ commit }, data) {
      commit('setSelectedMessage', data)
    },
    unsetSelectedMessage({ commit }) {
      commit('setSelectedMessage', '', {
        action: '',
        message: {}
      })
    }
  },
  getters: {
    getMessages: state => {
      return state.messages
    },
    getMessage: state => {
      return state.message
    },
    getSelectedMessage: state => {
      return state.selectedMessage
    }
  }
}

export default message;