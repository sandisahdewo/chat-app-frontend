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
        v-debounce:1s="endTyping"
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

import { mapMutations } from 'vuex'
import VEmojiPicker from 'v-emoji-picker';

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
  methods: {
    endTyping() {
      this.stopTyping()
    },
    send() {
      let data = {
        message: this.message,
        receiver_id: 1,
        type: 'text',
        created_at: this.$moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      }

      this.sendMessage(this.message)   
      this.message = ''

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
    },
    ...mapMutations(['startTyping', 'stopTyping', 'sendMessage'])
  },
  watch: {
    message(value) {
      if(value != '') {
        this.startTyping()
      }
    }
  }
}
</script>