const selectedUser = JSON.parse(localStorage.getItem('selectedUser'))
const contact = {
  state: {
    selected: selectedUser ? selectedUser.contact : {},
  },
  mutations: {
    setSelected (state, selected) {
      state.selected = selected
    }
  },
  getters: {
    getSelectedContact: state => {
      return state.selected
    },
  },
  actions: {
    setSelectedContact ({ commit }, contact) {
      localStorage.setItem('selectedUser', JSON.stringify(contact))
      commit('setSelected', contact.contact)
    }
  }
}

export default contact;