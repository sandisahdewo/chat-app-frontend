<template>
  <div class="contact">
    <h1>Contact Page</h1>
    <ul v-for="contact in contacts" v-bind:key="contact.id">
      <li>
        <a @click="selected(contact)" href="#">@{{ contact.username }} | {{ contact.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'contact',
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    return {
      user: user,
      contacts: [],
      authToken: user.token,
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
    }
  },
  beforeMount() {
    this.get()
  }
}
</script>