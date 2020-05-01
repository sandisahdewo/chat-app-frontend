<template>
   <v-container>
     <v-row class="mt-5" justify="center">
      <v-card width="50%">
        <v-card-title>Login</v-card-title>
        <v-card-subtitle>Input username and password to login.</v-card-subtitle>
        <v-card-text>
          <v-alert type="error" v-if="error.message">
            {{ error.message }}
            <ul v-for="(validation, key) in error.validation" v-bind:key="key" style="margin-top:10px; padding-left:20px">
              <li>{{ validation[0] }}</li>
            </ul>
          </v-alert>
          <v-text-field 
            outlined
            single-line
            dense
            label="Username"
            v-model="username"/>

        <v-text-field 
            outlined
            single-line
            dense
            :type="this.toggle_password_field ? '' : 'password'"
            :append-icon="this.toggle_password_field ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="togglePasswordField"
            label="Password"
            v-model="password"/>
        </v-card-text>
        <v-card-actions class="justify-end mr-3 mb-2">
          <router-link to="/register" class="caption mr-2">Not a member? Register here</router-link>
          <v-btn color="primary" @click="login" class="text-capitalize">Login</v-btn>
        </v-card-actions>
      </v-card>
  
    </v-row>
   </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: {
        message: '',
        validation: {}
      },
      toggle_password_field: false,
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
        if(response.data.code == 404) {
          this.error.message = response.data.message
          this.error.validation = {}
        } else if(response.data.code == 302) {
          this.error.message = response.data.message
          this.error.validation = response.error
        } else {
          localStorage.setItem('user', JSON.stringify(response.result))
          this.$router.push('contact')
        } 
      })
      .catch(err => {
        console.log(err.message)
      })
    },
    togglePasswordField: function() {
      this.toggle_password_field = !this.toggle_password_field
    },
  }
}
</script>