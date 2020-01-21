<template>
   <v-container>
     <v-row class="mt-5" justify="center">
      <v-card width="50%">
        <v-card-title>Register</v-card-title>
        <v-card-subtitle>Please fill input to become a member.</v-card-subtitle>
        <v-card-text>

        <v-text-field 
          outlined
          single-line
          dense
          label="Name"
          :error-messages="errors.name" 
          v-model="name"/>

        <v-text-field 
          outlined
          single-line
          dense
          label="Username"
          :error-messages="errors.username"
          v-model="username"/>

        <v-text-field 
          outlined
          single-line
          dense
          label="Email"
          :error-messages="errors.email" 
          v-model="email"/>

        <v-text-field 
            outlined
            single-line
            dense
            label="Password"
            :error-messages="errors.password" 
            v-model="password"/>

        <v-text-field 
            outlined
            single-line
            dense
            label="Confirm Password"
            v-model="password_confirmation"/>

        </v-card-text>
        <v-card-actions class="justify-end mr-3 mb-2">
          <router-link to="/" class="caption mr-2">Have a member? Login here</router-link>
          <v-btn color="primary" @click="register" class="text-capitalize">Register</v-btn>
        </v-card-actions>
      </v-card>
  
    </v-row>
   </v-container>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      active: 1,
      errors: {
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    register: async function() {
      const data = { 
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        active: this.active
      }

      await fetch('http://localhost:3000/users', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        if(response.errors) {
          this.errors = response.errors
          console.log(response.errors)
          console.log(this.errors.username[0])
        } else {
          console.log(response)
          this.$router.push('/')
        }
        // localStorage.setItem('user', JSON.stringify(response.result))
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