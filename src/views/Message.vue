<template>
  <v-container>
    <v-row justify="center">
      <v-card width="70%">
        <HeaderInformation></HeaderInformation>

        <v-divider></v-divider>

        <MessagesBox></MessagesBox>

        <InputBar/>
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

import HeaderInformation from '../components/Message/HeaderInformation'
import MessagesBox from '../components/Message/MessagesBox'
import InputBar from '../components/Message/InputBar'
// import { mapGetters } from 'vuex'

export default {
  name: 'Message',
  components: {
    HeaderInformation,
    MessagesBox,
    InputBar
  },
  data() {
    return {
      isTyping: false
    }
  },
  // computed: mapGetters({ selectedConctact: 'getSelectedContact' }),
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