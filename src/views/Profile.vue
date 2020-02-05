<template>
   <v-container>
     <v-row class="mt-5" justify="center">
      <v-card width="50%">
        <v-card-title>My Profile</v-card-title>
        <v-card-subtitle>You can change your profile here.</v-card-subtitle>
        <v-card-text class="pb-0">
          <v-text-field 
            outlined
            single-line
            dense
            label="Name"
            v-model="name"/>

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
            label="Email"
            v-model="email"/>

        </v-card-text>
        <v-card-actions class="justify-end mr-3 mb-2">
          <v-btn color="primary" @click="update" class="text-capitalize">Update</v-btn>
        </v-card-actions>
      </v-card>
  
    </v-row>
   </v-container>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    return {
      user: user,
      name: user.user.name,
      email: user.user.email,
      username: user.user.username,
      password: '',
      password_confirmation: '',
      toggle_password_field: false,
    }
  },
  methods: {
    async update() {
      const data = {
        email: this.email,
        name: this.name,
        avatar: this.avatar,
      }
      await fetch(`http://localhost:3000/users/${this.user.user.id}`, {
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        if(response.errors) {
          this.errors = response.errors
        } else {
          console.log(response)
        }
      })
      .catch(err => {
        console.log(err.message)
      })

    }
  }
}
</script>