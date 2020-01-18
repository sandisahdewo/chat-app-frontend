<template>
  <div class="message">
    <h3>{{ contact.name }}</h3>
    <ul v-for="message in messages" v-bind:key="message.id">
      <li v-if="message.receiver_id == user.user.id" style="background-color:white;">{{ message.message }}</li>
      <li v-else style="background-color:green; color:white">{{ message.message }}</li>
    </ul>

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
    receiveMessage: function(data) {
      this.messages.push(data)
    }
  },
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    const contact = JSON.parse(localStorage.getItem('contact'))
    return {
      user: user,
      message: '',
      messages: [],
      authToken: user.token,
      sender_id: user.user.id,
      contact: contact,
    }
  },
  methods: {
    get: async function() {
      const contact = JSON.parse(localStorage.getItem('contact'))
      fetch(`http://localhost:3000/messages/${this.sender_id}/${contact.id}`, {
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
          receiver_id: this.contact.id,
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