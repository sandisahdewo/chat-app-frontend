<template>
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
            <img v-if="selectedContact.avatar" :src="`http://localhost:3000/${selectedContact.avatar.name}`">
            <v-img v-else :src="require('../../../public/avatar/default.jpg')"></v-img>
          </v-avatar>
        </v-col>
        <v-col>
          {{ selectedContact.name }}
          <p class="caption" style="padding:0px; margin:0px; font-size:8px" v-if="isTyping">Typing...</p>
        </v-col>
      </v-row>
    </div>
  </v-card-title>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'MessageTitle',
  sockets: {
    startTypingMessage: function(data) {
      if(data.receiver.id == this.user.id) {
        this.isTyping = true
      }
    },
    stopTypingMessage: function(data) {
      if(data.receiver.id == this.user.id) {
        this.isTyping = false
      }
    }
  },
  data() {
    return {
      isTyping: false
    }
  },
  computed: mapGetters({
    user: 'getUser',
    selectedContact: 'getSelectedContact' 
  }),
  methods: {
    goToContact: function() {
      this.$router.push('contact')
    },
  },
  // computed: {
  //   ...mapGetters(['getTypingStatus'])
  // }
}
</script>