<template>
  <v-card-text class="overflow-x-auto" style="max-height:65vh" v-chat-scroll="{always: false, smooth: true, notSmoothOnInit: false}">
    <div v-for="(message, key) in messages" v-bind:key="key"> 
      <MessageRowReceiver 
        v-bind:message="message"
        v-bind:row="key"
        v-if="message.receiver_id == user.id"
      />

      <MessageRowSender
        v-bind:message="message"
        v-bind:row="key"
        v-else
      />
    </div>

    <v-row class="justify-center" v-if="messages.length < 1">
      <v-alert
        class="caption"
        dense
        outlined
        color="blue"
      >
        No message found. Start chat with typing and send.
      </v-alert>
    </v-row>
  </v-card-text>
</template>

<script>

import MessageRowReceiver from '../../components/Message/MessageRowReceiver'
import MessageRowSender from '../../components/Message/MessageRowSender'
import { mapGetters } from 'vuex'

export default {
  name: "MessageBox",
  components: {
    MessageRowReceiver,
    MessageRowSender
  },
  sockets: {
    receiveMessage: function(data) {
      let messageSend = this.messages.findIndex((message) => {
        return message.created_at == data.created_at
      })

      if(data.sender_id == this.user.id) {
        this.messages.splice(messageSend, 1, data)

        if(this.selectedContact.id != data.sender_id) {
          this.$socket.emit('countUnreadMessage', { receiver: this.selectedContact, sender: this.user })
        }
      } else {
        this.$store.dispatch('pushMessage', data)

        // if receiver still in sender message page, also read the last message
        if(this.selectedContact.id == data.sender_id) {
          this.read()
        } 

        this.$socket.emit('countUnreadMessage', { receiver: this.selectedContact, sender: this.user })
      }
    },
    markAsReadMessage: function(data) {
      data.forEach(element => {
        const find = this.messages.findIndex(message => {
          return message.id == element.id
        })

        if(element.sender_id == this.user.id) {
          this.messages.splice(find, 1, element)
        }
      });
    },
    markAsDeletedMessage: function(data) {
      const find = this.messages.findIndex(message => {
        return message.id == data.result.id
      })

      this.messages.splice(find, 1, data.result)
    }
  },
  computed: mapGetters({
    token: 'getToken',
    messages: 'getMessages',
    user: 'getUser',
    selectedContact: 'getSelectedContact'
  }),
  methods: {
    read: async function() {
      let messageNotRead = await this.messages.filter((message) => {
        return message.read_at == null && message.sender_id == this.selectedContact.id;
      })

      this.$socket.emit('readMessage', {
        contact: this.selectedContact,
        user: this.user,
        messageNotRead
      })
    },
    get: async function() {
      await fetch(`http://localhost:3000/messages/${this.user.id}/${this.selectedContact.id}`, {
          headers: {
              Authorization: `Bearer ${this.token}`
          }
        })
        .then(response => response.json())
        .then(response => {
          this.$store.commit('storeMessages', response.result)
        })
        .catch(err => {
          console.log(err.message)
        })

      this.read()
    }
  },
  beforeMount() {
    this.get()
  },
}
</script>