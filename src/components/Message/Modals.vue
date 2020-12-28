<template>
  <div>
    <!-- dialog to dispatch edit or delete action -->
    <v-dialog v-model="modalAction.open" max-width="190">
      <v-card align="center">
        <v-card-title class="headline"></v-card-title>
        <v-card-text class="pb-0">
          <v-btn color="green darken-1" text @click="edit">Edit</v-btn>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-btn color="green darken-1" text @click="destroy">Delete</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog to show image -->
    <v-dialog v-model="modalImage.open" max-width="490">
      <v-card align="center">
        <v-card-title class="headline"></v-card-title>
        <v-img :src="`http://localhost:3000/${modalImage.selectedMessage.files.name}`"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Modals',
  computed: mapGetters({
    token: 'getToken',
    modalAction: 'getModalAction',
    modalImage: 'getModalImage'
  }),
  methods: {
    edit: function() {
      this.$store.dispatch('setMessage', this.modalAction.selectedMessage.message)
      this.$store.dispatch('setSelectedMessage', {
        action: 'edit',
        selected: this.modalAction.selectedMessage
      })
      this.$store.dispatch('closeModalAction')
    },
    destroy: async function() {
      await fetch(`http://localhost:3000/messages/${this.modalAction.selectedMessage.id}`, {
        headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(response => {
        this.$store.dispatch('closeModalAction')
        this.$socket.emit('markAsDeletedMessage', response)
      })
    }
  }
}
</script>