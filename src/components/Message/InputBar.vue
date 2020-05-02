<template>
  <v-card-text>
    <v-dialog v-model="emoji.dialog" max-width="370">
      <v-card>
        <v-card-title class="headline"></v-card-title>
        <v-card-text class="pb-0">
          <VEmojiPicker @select="selectEmoji" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="mx-3">
      <v-btn class="mr-1" text tile large icon color="gray" @click="openEmojiDialog">
        <v-icon>mdi-sticker-emoji</v-icon>
      </v-btn>
      <v-btn class="mr-1" text tile large icon color="gray" @click="openUploadFileDialog">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>

      <input type="file" ref="file" style="display:none" accept=".jpg"/>

      <v-text-field 
        v-debounce:1s="stopTyping"
        outlined
        single-line
        dense
        rounded
        label="Type a message"
        v-model="message"/>

      <v-btn class="ml-2" text tile large icon color="gray" @click="send">
        <v-icon>mdi-send</v-icon>
      </v-btn>

    </v-row>
  </v-card-text>
</template>

<script>

import VEmojiPicker from 'v-emoji-picker';
import { mapGetters } from 'vuex'

export default {
  name: 'InputBox',
  components: {
    VEmojiPicker
  },
  data() {
    return {
      message: '',
      emoji: {
        dialog: false,
        selected: ''
      }
    }
  },
  computed: mapGetters({ 
    user: 'getUser',
    selectedContact: 'getSelectedContact',
    token: 'getToken' 
  }), 
  methods: {
    stopTyping() {
      this.$socket.emit('stopTypingMessage', { receiver: this.selectedContact, sender: this.user })
    },
    send() {
      let data = {
        message: this.message,
        receiver_id: this.selectedContact.id,
        type: 'text',
        created_at: this.$moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      }

      this.sendMessage(this.message)   
      this.message = ''

      fetch('http://localhost:3000/messages', {
        headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        // this.$socket.emit('sendMessage', response.result)
      })
    },
    openUploadFileDialog() {
      this.dialog = { ...this.dialog, file: true }
    },
    openEmojiDialog() {
      this.emoji.dialog = true
    },
    selectEmoji(emoji) {
      console.log(emoji)
    }
  },
  watch: {
    message(value) {
      if(value != '') {
        this.$socket.emit('startTypingMessage', { receiver: this.selectedContact, sender: this.user })
      }
    }
  }
}
</script>