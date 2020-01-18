<template>
  <div class="message">
    <ul v-for="message in messages" v-bind:key="message.id">
      <li>{{ message.message }}</li>
    </ul>

    <input type="text" v-model="receiver_id">
    <input type="text" v-model="message">
    <button @click="send">Send</button>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
    },
    receiveMessage: function(data) {
      this.messages.push(data)
    }
  },
  data() {
    return {
      message: '',
      messages: [],
      authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJzYW5kaXNhaGRld28iLCJpYXQiOjE1NzkxMzMyMTR9.qlG7yzyzYiQQMRUVlZFGFQQYj9XruEPRnotsmY0neD4',
      receiver_id: ''
    }
  },
  methods: {
    get: async function() {
      fetch(`http://localhost:3000/messages/${this.receiver_id}`, {
          headers: {
              Authorization: `Bearer ${this.authToken}`
          }
        })
        .then(response => response.json())
        .then(response => {
            this.messages = response.result
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    send: async function() {
      let data = {
          message: this.message,
          receiver_id: this.receiver_id,
          type: 'text'
      }
      await fetch('http://localhost:3000/messages', {
        headers: {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        this.$socket.emit('sendMessage', response.result )
        this.message = ''
      })

    }
  },
  beforeMount() {
    this.get()
  }
}
</script>