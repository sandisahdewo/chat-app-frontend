<template>
  <v-card-text>
    <!-- dialog to show all emojis -->
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

    <!-- dialog to show image before send -->
    <v-dialog v-model="file.dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"></v-card-title>
        <v-card-text class="pb-0">
          <v-img :src="file.preview"></v-img>
          <v-text-field 
            v-debounce:1s="stopTyping"
            single-line
            dense
            label="Add a caption"
            v-model="file.caption"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="file.dialog = false">Batal</v-btn>
          <v-btn color="green darken-1" text @click="sendWithFile">Kirim</v-btn>
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

      <input type="file" ref="file" style="display:none" accept=".jpg" @change="onFilePicked"/>

      <v-text-field 
        v-debounce:1s="stopTyping"
        outlined
        single-line
        dense
        rounded
        label="Type a message"
        :value="message"
        @input="typing"/>

      <v-btn class="ml-2" v-if="selectedMessage.action == 'edit'" text tile large icon @click="update" color="gray">
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <v-btn class="ml-2" v-else text tile large icon color="gray" @click="send">
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
      file: {
        dialog: false,
        selected: '',
        preview: '',
        caption: ''
      },
      emoji: {
        dialog: false,
        selected: ''
      }
    }
  },
  computed: mapGetters({ 
    user: 'getUser',
    selectedContact: 'getSelectedContact',
    token: 'getToken',
    message: 'getMessage',
    selectedMessage: 'getSelectedMessage'
  }),
  methods: {
    typing(value) {
      this.$store.dispatch('setMessage', value)
    },
    stopTyping() {
      this.$socket.emit('stopTypingMessage', { receiver: this.selectedContact, sender: this.user })
    },
    openUploadFileDialog() {
      this.$refs.file.click()
    },
    onFilePicked: function(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      this.file.dialog = true
      this.file.selected = files[0]
      this.createImage(files[0])
    },
    createImage(file) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.file.preview = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    openEmojiDialog() {
      this.emoji.dialog = true
    },
    selectEmoji(emoji) {
      this.$store.dispath('setMessage', this.message + emoji.data)
    },
    send() {
      let data = {
        message: this.message,
        receiver_id: this.selectedContact.id,
        type: 'text',
        created_at: this.$moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      }

      this.$store.dispatch('pushMessage', data)
      this.$store.dispatch('unsetMessage')

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
        this.$socket.emit('sendMessage', response.result)
      })
    },
    sendWithFile: function() {
      const data = {
          message: this.message,
          receiver_id: this.selectedContact.id,
          type: 'image',
          created_at: this.$moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
          files: {
            name: this.file.selected.name,
            caption: this.file.caption,
            message_file: this.file.selected
          }
      }

      this.$store.dispatch('pushMessage', data)

      const formData = new FormData()
      formData.append('message', data.message)
      formData.append('receiver_id', data.receiver_id)
      formData.append('type', data.type)
      formData.append('created_at', data.created_at)
      formData.append('caption', data.files.caption)
      formData.append('message_file', data.files.message_file)

      this.file.dialog = false

      // push message with clock icon
      this.file.caption = ''

      fetch('http://localhost:3000/messages/file', {
        headers: {
            Authorization: `Bearer ${this.token}`,
        },
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(response => {
        this.$socket.emit('sendMessage', response.result)
      })
    },
    update: async function() {
      await fetch(`http://localhost:3000/messages/${this.selectedMessage.message.id}`, {
        headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({message: this.message})
      })
      .then(response => response.json())
      .then(response => {
        this.$store.dispatch('unsetSelectedMessage');
        this.$store.dispatch('unsetMessage');
        this.$socket.emit('markAsDeletedMessage', response)
      })
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