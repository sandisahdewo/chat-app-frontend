const modals = {
  state: {
    action: { // modal action
      open: false,
      selectedMessage: {}
    },
    image: {
      open: false,
      selectedMessage: {
        files: {}
      }
    }
  },
  mutations: {
    openModalAction(state, selectedMessage) {
      state.action.open = true
      state.action.selectedMessage = selectedMessage
    },
    closeModalAction(state) {
      state.action.open = false
      state.action.selectedMessage = {}
    },
    openModalImage(state, selectedMessage) {
      state.image.open = true
      state.image.selectedMessage = selectedMessage
    },
    closeModalImage(state) {
      state.image.open = false
      state.image.selectedMessage = {}
    }
  },
  actions: {
    openModalAction({ commit }, message) {
      commit('openModalAction', message)
    },
    closeModalAction({ commit }) {
      commit('closeModalAction')
    },
    openModalImage({ commit }, message) {
      commit('openModalImage', message)
    },
    closeModalImage({ commit }) {
      commit('closeModalImage')
    },
  },
  getters: {
    getModalAction: state => {
      return state.action
    },
    getModalImage: state => {
      return state.image
    }
  }
}

export default modals;