<template>
  <div class="login">
    <input type="text" v-model="username">
    <input type="text" v-model="password">
    <button @click="login">Login</button>
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
      const data = { username, password }

      await fetch('http://localhost:3000/messages', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        this.user = response.result
      })
    }
  }
}
</script>