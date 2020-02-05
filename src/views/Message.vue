<template>
  <v-container>
    <v-row justify="center">
      <v-card width="50%">
        <v-card-title class="py-0 align-center">
          <div class="justify-start">
            <v-row>
              <v-col class="px-0 col-auto">
                <v-btn tile large icon @click="goToContact">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </v-col>
              <v-col class="px-0 col-auto">
                <v-avatar class="mr-3">
                  <img v-if="contact.avatar" :src="`http://localhost:3000/${contact.avatar.name}`">
                  <v-img v-else :src="require(`../../public/avatar/default.jpg`)"></v-img>
                </v-avatar>
              </v-col>
              <v-col>
                {{ contact.name }}
                <p class="caption" style="padding:0px; margin:0px; font-size:8px" v-if="isTyping">Typing...</p>
              </v-col>
            </v-row>
          </div>

        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="scroll" id="scroll" style="max-height:500px">
          <div v-for="message in messages" v-bind:key="message.id"> 
            <v-row
              v-if="message.receiver_id == user.user.id"
              class="mx-3 mr-8 pr-8">
              <v-alert
                class="caption"
                dense
                color="light-blue lighten-4"
              >
                {{ message.message }}
                <v-row class="float-right mt-4">
                  <v-col class="px-0 py-0">
                    <div style="font-size:8px;">{{ new Date(message.send_at) | moment('HH:mm') }}</div>
                  </v-col>
                </v-row>
              </v-alert>
            </v-row>

            <v-row v-else class="mx-3 justify-end ml-8 pl-8">
              <v-alert
                class="caption"
                dense
                color="green lighten-4"
              >

                {{ message.message }}
                
                <v-row class="float-right mt-4">
                  <v-col class="px-0 py-0">
                    <div style="font-size:8px;">{{ new Date(message.created_at) | moment('HH:mm') }}</div>
                  </v-col>
                  <v-col class="px-1 py-0">
                    <v-icon v-if="message.send_at == null" style="font-size:10px; font-color:orangered" class="pb-1 px-1">mdi-clock</v-icon>
                    <v-icon v-if="message.send_at != null && message.read_at == null" style="font-size:10px" class="pb-1 px-1">mdi-check</v-icon>
                    <v-icon v-if="message.read_at != null" style="font-size:10px; color: deepskyblue">mdi-check-all</v-icon>
                  </v-col>
                  <v-col class="px-0 py-0">
                    <!-- <p style="font-size:6px; padding:0px; margin:0px">Edited</p> -->
                  </v-col>
                </v-row>
              </v-alert>
            </v-row>
            
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
        <v-card-text>
          <v-row class="mx-3">
            <v-text-field 
              v-debounce:1s="stopTyping"
              outlined
              single-line
              dense
              rounded
              label="Type a message"
              v-model="message"/>

            <v-btn class="ml-2" text tile large icon @click="send" color="gray">
              <v-icon>mdi-send</v-icon>
            </v-btn>

          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
.scroll {
  overflow-y: auto;
}
</style>

<script>
export default {
  name: 'Message',
  sockets: {
    startTypingMessage: function(data) {
      if(data.receiver.id == this.user.user.id) {
        this.isTyping = true
      }
    },
    stopTypingMessage: function(data) {
      if(data.receiver.id == this.user.user.id) {
        this.isTyping = false
      }
    },
    receiveMessage: function(data) {
      let messageSend = this.messages.findIndex((message) => {
        return message.created_at == data.created_at
      })

      if(data.sender_id == this.user.user.id) {
        this.messages.splice(messageSend, 1, data)

        if(this.contact.id != data.sender_id) {
          this.$socket.emit('countUnreadMessage', { receiver: this.contact, sender: this.user })
        }
      } else {
        this.messages.push(data)

        this.scrollToBottom()

        // if receiver still in sender message page, also read the last message
        if(this.contact.id == data.sender_id) {
          this.read()
        } 

        console.log('count unread message 2')
        // this.$socket.emit('countUnreadMessage', { receiver: this.contact, sender: this.user })
      }

    },
    markAsReadMessage: function(data) {
      data.forEach(element => {
        const find = this.messages.findIndex(message => {
          return message.id == element.id
        })

        if(element.sender_id == this.user.user.id) {
          this.messages.splice(find, 1, element)
        }
      });
    }
  },
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    const contact = JSON.parse(localStorage.getItem('contact'))
    return {
      isTyping: false,
      user: user,
      message: '',
      messages: [],
      authToken: user.token,
      sender_id: user.user.id,
      contact: contact,
    }
  },
  methods: {
    read: async function() {
      let messageNotRead = await this.messages.filter((message) => {
        return message.read_at == null && message.sender_id == this.contact.id;
      })
      
      this.$socket.emit('readMessage', {
        contact: this.contact,
        user: this.user,
        messageNotRead
      })
    },
    get: async function() {
      await fetch(`http://localhost:3000/messages/${this.sender_id}/${this.contact.id}`, {
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

      this.scrollToBottom()
      this.read() 
    },
    send: async function() {
      let data = {
          message: this.message,
          receiver_id: this.contact.id,
          type: 'text',
          created_at: this.$moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      }

      // push message with clock icon
      this.messages.push(data)
      this.message = ''
      this.scrollToBottom()

      fetch('http://localhost:3000/messages', {
        headers: {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        this.$socket.emit('sendMessage', response.result)
      })
    },
    goToContact: function() {
      this.$router.push('contact')
    },
    scrollToBottom: function() {
      const messageContainer = this.$el.querySelector('#scroll')
      messageContainer.scrollTop = messageContainer.scrollHeight 
    },
    stopTyping: function() {
      this.$socket.emit('stopTypingMessage', { receiver: this.contact, sender: this.user })
    },
    countUnreadMessage: function() {
      console.log('unread')
    }
  },
  beforeMount() {
    this.get()
  },
  watch: {
    message: function(value) {
      if(value != '') {
        this.$socket.emit('startTypingMessage', { receiver: this.contact, sender: this.user })
      }
    }
  }
}
</script>