<template>
  <v-card-text class="scroll" id="scroll" style="max-height:500px">
    <div v-for="(message, key) in messages" v-bind:key="key"> 
      <MessageRowReceiver 
        v-bind:message="message"
        v-bind:row="key"
        v-if="message.receiver_id == user.user.id"
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
  computed: {
    ...mapGetters({
      messages: 'getMessages'
    })
  },
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    return {
      user
    }
  }
}
</script>