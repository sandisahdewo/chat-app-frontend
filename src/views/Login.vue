<template>
  <div class="login">
    <input type="text" v-model="username">
    <input type="text" v-model="password">
    <button @click="login">Login</button>
    <button @click="whois">Whois</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      user: {}
    }
  },
  methods: {
    login: async function() {
      const data = { username: this.username, password: this.password }

      await fetch('http://localhost:3000/auth/login', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        localStorage.setItem('user', JSON.stringify(response.result))
        this.$router.push('contact')
      })
      .catch(err => {
        console.log(err.message)
      })
    },
    whois: function() {
      const storage = JSON.parse(localStorage.getItem('user'))
      console.log(storage)
    }
  }
}
</script>