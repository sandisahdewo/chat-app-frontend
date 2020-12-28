<template>
  <v-row
    @dblclick="message.deleted_at != null ? '' : select(row)"
    class="mx-3 justify-end ml-8 pl-8">
    <v-alert
      class="caption"
      dense
      color="green lighten-4"
    >
      <div v-if="message.deleted_at != null">
        <v-icon style="font-size:12px; font-color:orangered">mdi-cancel</v-icon>
        Deleted message
      </div>
      <div v-else>
        <div v-if="message.type == 'text'">
          {{ message.message }}
        </div>

        <div v-if="message.type == 'image'">
          <div v-if="message.send_at == null">Loading...</div>
          <v-img @click="viewImage(row)" v-if="message.send_at != null" max-width="250" :src="`http://localhost:3000/${message.files.name}`"></v-img>
          <div>{{ message.files.caption }}</div>
        </div>
      </div>

      <v-row class="float-right" v-if="message.deleted_at == null">
        <v-col class="px-2 py-0" v-if="message.updated_at != null">
          <p style="font-size:8px; padding:0px; margin:0px; color: grey">Edited</p>
        </v-col>
        <v-col class="px-0 py-0">
          <div style="font-size:8px;">{{ new Date(message.created_at) | moment('HH:mm') }}</div>
        </v-col>
        <v-col class="px-1 py-0">
          <v-icon v-if="message.send_at == null" style="font-size:10px; font-color:orangered" class="pb-1 px-1">mdi-clock</v-icon>
          <v-icon v-if="message.send_at != null && message.read_at == null" style="font-size:10px" class="pb-1 px-1">mdi-check</v-icon>
          <v-icon v-if="message.read_at != null" style="font-size:10px; color: deepskyblue">mdi-check-all</v-icon>
        </v-col>
      </v-row>
    </v-alert>
  </v-row>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'MessageRowReceiver',
  props: {
    message: Object,
    row: Number
  },
  data() {
    return {
      selected: {
        message: {},
        dialog: false,
        action: ''
      }
    }
  },
  computed: mapGetters({
    token: 'getToken',
    messages: 'getMessages',
    user: 'getUser',
    selectedContact: 'getSelectedContact'
  }),
  methods: {
    select: function(key) {
      this.$store.dispatch('openModalAction', this.messages[key])
    },
    viewImage: function(key) {
      this.$store.dispatch('openModalImage', this.messages[key])
    }
  }
}
</script>