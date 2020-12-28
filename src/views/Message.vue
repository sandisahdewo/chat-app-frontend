<template>
  <v-container>
    <v-row justify="center">
      <v-card width="70%">
        <HeaderInformation></HeaderInformation>

        <Modals></Modals>

        <v-divider></v-divider>

        <MessagesBox></MessagesBox>

        <InputBar/>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>

import HeaderInformation from '../components/Message/HeaderInformation'
import Modals from '../components/Message/Modals'
import MessagesBox from '../components/Message/MessagesBox'
import InputBar from '../components/Message/InputBar'

export default {
  name: 'Message',
  components: {
    HeaderInformation,
    Modals,
    MessagesBox,
    InputBar
  },
  data() {
    return {
      isTyping: false
    }
  },
  methods: {
    startTyping() {
      this.isTyping = true
    },
    stopTyping() {
      this.isTyping = false
    }
  }
}
</script>