<template>
  <div class="contact">
    <v-row class="px-2 py-2">
      <v-col class="col-auto mr-auto">
        <h2>Your Contact: {{ user.user.name }}</h2>
      </v-col>
      <v-col class="col-auto">
        <v-btn text icon color="red" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col> 
    </v-row>
    <v-list class="px-2 py-2">
      <v-subheader>Sort By Last Message</v-subheader>
      <v-list-item-group two-line color="primary">
        <v-list-item
          v-for="(contact, i) in contacts"
          :key="i"
        >
          <v-list-item-avatar>
            <v-img :src="require(`../../public/avatar/${i}.jpg`)"></v-img>
          </v-list-item-avatar>

          <v-list-item-content @click="selected(contact)">
            <v-list-item-title v-text="contact.name"></v-list-item-title>
            <v-list-item-subtitle v-if="contact.is_typing">Typing...</v-list-item-subtitle>
            <v-list-item-subtitle v-if="!contact.is_typing" v-text="contact.username"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-badge
              color="green"
              dot
            >
            </v-badge>
          </v-list-item-action>

        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>
<script>
export default {
  name: 'contact',
  sockets: {
    startTypingMessage: function(data) {
      const contact = this.contacts.findIndex(contact => {
        return data.sender.user.id == contact.id && data.receiver.id == this.user.user.id
      })

      if(contact != -1) {
        const withTyping = {
          ...this.contacts[contact],
          is_typing: true
        }

        this.contacts.splice(contact, 1, withTyping)
      }
    },
    stopTypingMessage: function(data) {
      const contact = this.contacts.findIndex(contact => {
        return data.sender.user.id == contact.id && data.receiver.id == this.user.user.id
      }) 

      if(contact != -1) {
        this.contacts.splice(contact, 1, data.sender.user)
      }
    },
  },
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    return {
      user: user,
      contacts: [],
      authToken: user.token
    }
  },
  methods: {
    get: async function () {
      fetch(`http://localhost:3000/users?except=${this.user.user.id}`, {
          headers: {
              Authorization: `Bearer ${this.authToken}`
          }
        })
        .then(response => response.json())
        .then(response => {
            this.contacts = response.result
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    selected: function(contact) {
      localStorage.setItem('contact', JSON.stringify(contact))
      this.$router.push('message')
    },
    logout: function() {
      localStorage.removeItem('contact');
      localStorage.removeItem('user');
      this.$router.push('/')
    }
  },
  beforeMount() {
    this.get()
    localStorage.removeItem('contact');
  }
}
</script>