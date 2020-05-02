const message = {
  state: {
    messages: []
  },
  mutations: {
    sendMessage (state, text) {
      state.messages.push({
        "sender_id": 1,
        "message": text,
        "receiver_id": 14,
        "type": "text",
        "relation": "user",
        "relation_id": 1,
        "created_at": "2020-02-22 21:10:33",
        "send_at": "2020-03-08T05:17:25.444Z",
        "id": 1
      })
    }
  },
  getters: {
    getMessages: state => {
      return state.messages
    }
  }
}

export default message;