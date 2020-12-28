<template>
  <v-row
    class="mx-3 mr-8 pr-8">
    <v-alert
      class="caption"
      dense
      color="light-blue lighten-4"
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
          <v-img v-if="message.send_at != null" max-width="250" :src="`http://localhost:3000/${message.files.name}`"></v-img>
          <div>{{ message.files.caption }}</div>
        </div>
      </div>

      <v-row class="pl-3" v-if="message.deleted_at == null">
        <v-col class="col-auto pr-1 pl-0 py-0" v-if="message.updated_at != null">
          <p style="font-size:8px; padding:0px; margin:0px; color: grey">Edited</p>
        </v-col>
        <v-col class="px-0 py-0">
          <div style="font-size:8px;">{{ new Date(message.send_at) | moment('HH:mm') }}</div>
        </v-col>
      </v-row>
    </v-alert>
  </v-row>
</template>

<script>
export default {
  name: 'MessageRowReceiver',
  props: {
    message: Object,
    row: Number,
  }
}
</script>