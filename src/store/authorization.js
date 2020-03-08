const user = JSON.parse(localStorage.getItem('user'))
const authorization = {
  state: {
    user: user ? user : {}
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
    }
  },
  getters: {
    getUser: state => {
      return state.user.user
    },
    getToken: state => {
      return state.user.token
    }
  }
}

export default authorization;