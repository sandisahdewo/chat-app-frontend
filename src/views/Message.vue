<template>
  <v-container>
    <v-row justify="center">
      <v-dialog v-model="file.showDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline"></v-card-title>
          <v-card-text class="pb-0">
            <v-img :src="file.previewSelected"></v-img>
            <v-text-field 
              v-debounce:1s="stopTyping"
              single-line
              dense
              label="Add a caption"
              v-model="file.caption"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="file.showDialog = false">Batal</v-btn>
            <v-btn color="green darken-1" text @click="sendWithFile">Kirim</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="selected.dialog" persistent max-width="190">
        <v-card align="center">
          <v-card-title class="headline"></v-card-title>
          <v-card-text class="pb-0">
            <v-btn color="green darken-1" text @click="selected.dialog = false">Edit</v-btn>
          </v-card-text>
          <v-card-text class="pb-0">
            <v-btn color="green darken-1" text @click="destroy">Delete</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
          <div v-for="(message, key) in messages" v-bind:key="message.id"> 
            <v-row
              v-if="message.receiver_id == user.user.id"
              class="mx-3 mr-8 pr-8">
              <v-alert
                class="caption"
                dense
                color="light-blue lighten-4"
              >
                <div v-if="message.deleted_at != null">
                  Deleted message
                </div>
                <div v-else>
                  <div v-if="message.type == 'text'">
                    {{ message.message }}
                  </div>

                  <div v-if="message.type == 'image'">
                    <div v-if="message.send_at == null">Loading...</div>
                    <v-img v-if="message.send_at != null" max-width="250" :src="`http://localhost:3000/${message.files.name}`"></v-img>
                    <div>{{ message.files.caption }}</div>
                  </div>
                </div>
                
                <v-row class="float-right">
                  <v-col class="px-0 py-0">
                    <div style="font-size:8px;">{{ new Date(message.send_at) | moment('HH:mm') }}</div>
                  </v-col>
                </v-row>
              </v-alert>
            </v-row>

            <v-row
              @click="message.deleted_at != null ? '' : select(key)"
              v-else class="mx-3 justify-end ml-8 pl-8">
              <v-alert
                class="caption"
                dense
                color="green lighten-4"
              >
                <div v-if="message.deleted_at != null">
                  Deleted message
                </div>
                <div v-else>
                  <div v-if="message.type == 'text'">
                    {{ message.message }}
                  </div>

                  <div v-if="message.type == 'image'">
                    <div v-if="message.send_at == null">Loading...</div>
                    <v-img v-if="message.send_at != null" max-width="250" :src="`http://localhost:3000/${message.files.name}`"></v-img>
                    <div>{{ message.files.caption }}</div>
                  </div>
                </div>
                
                <v-row class="float-right">
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
            <v-btn class="mr-2" text tile large icon @click="pickFile" color="gray">
              <v-icon>mdi-attachment</v-icon>
            </v-btn>

            <input type="file" ref="file" style="display:none" accept=".jpg" @change="onFilePicked"/>

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
    }, 
    markAsDeletedMessage: function(data) {
      const find = this.messages.findIndex(message => {
        return message.id == data.result.id
      })

      this.messages.splice(find, 1, data.result)
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
      file: {
        showDialog: false,
        selected: '',
        previewSelected: '',
        caption: ''
      },
      selected: {
        message: {},
        dialog: false
      }
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
    pickFile: function() {
      this.$refs.file.click()
    },
    onFilePicked: function(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      this.file.showDialog = true
      this.file.selected = files[0]
      this.createImage(files[0])
    },
    createImage(file) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.file.previewSelected = e.target.result;
      };
      reader.readAsDataURL(file);
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
    sendWithFile: function() {
      const data = {
          message: this.message,
          receiver_id: this.contact.id,
          type: 'image',
          created_at: this.$moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
          files: {
            name: this.file.selected.name,
            caption: this.file.caption,
            message_file: this.file.selected
          }
      }

      this.messages.push(data)

      const formData = new FormData()
      formData.append('message', data.message)
      formData.append('receiver_id', data.receiver_id)
      formData.append('type', data.type)
      formData.append('created_at', data.created_at)
      formData.append('caption', data.files.caption)
      formData.append('message_file', data.files.message_file)

      this.file.showDialog = false

      // // push message with clock icon
      this.file.caption = ''
      this.scrollToBottom()

      fetch('http://localhost:3000/messages/file', {
        headers: {
            Authorization: `Bearer ${this.authToken}`,
        },
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(response => {
        this.$socket.emit('sendMessage', response.result)
      })
    },
    select: function(key) {
      this.selected = {
        message: this.messages[key],
        dialog: true 
      }
    },
    destroy: async function() {
      await fetch(`http://localhost:3000/messages/${this.selected.message.id}`, {
        headers: {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(response => {
        this.selected = { message: {}, dialog: false }
        this.$socket.emit('markAsDeletedMessage', response)
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