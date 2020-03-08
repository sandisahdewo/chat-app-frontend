<template>
  <v-card-title class="py-0 align-center">
    <div class="justify-start">
      <v-row>
        <v-col class="px-0 col-auto">
          <v-btn tile large icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col class="px-0 col-auto">
          <v-avatar class="mr-3">
            <v-img :src="require('../../../public/avatar/default.jpg')"></v-img>
          </v-avatar>
        </v-col>
        <v-col>
          {{ contact.name }}
          <p class="caption" style="padding:0px; margin:0px; font-size:8px" v-if="getTypingStatus">Typing...</p>
        </v-col>
      </v-row>
    </div>
  </v-card-title>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'MessageTitle',
  props: {
    contact: {
      type: Object,
      default: () => {
        return {
          name: '',
          avatar: '',
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getTypingStatus'])
  }
}
</script>