<template>
   <v-container>
     <v-row class="mt-5" justify="center">
      <v-card width="50%">
        <v-alert class="mx-2 my-2" :type="alert.alert_type" :value="alert.alert_show">{{alert.alert_text}}</v-alert>
        <v-card-title>
          <v-btn tile large icon class="mr-1" @click="goToContact">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          My Avatar
        </v-card-title>
        <v-card-subtitle class="ml-12">You can change your avatar here.</v-card-subtitle>
        <v-card-text class="pb-0">

        <input type="file" ref="image" style="display:none" accept=".jpg" @change="onFilePicked"/>

        </v-card-text>

        <v-card-text align="center" v-if="!avatar.image">
          <v-row justify="center">
            <v-avatar color="blue" size="350">
              <img :src="avatar">
            </v-avatar>

            <v-btn
              color="gray"
              absolute
              bottom
              center
              icon
              outlined
              large
              @click="pickFile"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </v-row>
        </v-card-text>

        <v-card-text align="center" v-if="avatar.image">
          <v-row justify="center">
            <v-avatar size="350">
              <img :src="avatar.image">
            </v-avatar>
            <v-btn
              color="red"
              absolute
              bottom
              center
              icon
              outlined
              large
              @click="remove"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-row>
        </v-card-text>

        <v-card-actions v-show="avatar.file">
          <v-btn
            color="green"
            absolute
            bottom
            center
            icon
            outlined
            large
            @click="upload"
          >
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
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
      avatar: {
        file: null,
        image: '',
        data: {}
      },
      alert: {
        alert_type: 'success',
        alert_show: false,
        alert_text: ''
      }
    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click()
    },
    onFilePicked(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      this.avatar.file = files[0]
      this.createImage(files[0])
    },
    createImage(file) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.avatar.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async remove() {
      await fetch(`http://localhost:3000/avatar/delete/${this.avatar.data.id}`, {
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(response => {
        if(response.data.code == 200) {
          this.avatar = { file: null, image: null}
        } else {
          this.alert = { alert_type: 'error', alert_show: true, alert_text: response.result}
        }
      })
      .catch(error => {
        this.alert = { alert_type: 'error', alert_show: true, alert_text: error.message}
      })
    },
    async find() {
      await fetch(`http://localhost:3000/avatar/last-uploaded/user`, {
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      .then(response => response.json())
      .then(response => {
        if(response.result.hasOwnProperty('name')) {
          this.avatar.image = `http://localhost:3000/${response.result.name}`
          this.avatar.data = response.result
        }
      })
      .catch(error => {
        console.log(error.message)
      })
    },
    async upload() {
      const formData = new FormData()
      formData.append('avatar', this.avatar.file)
      formData.append('name', `${this.user.user.name}-avatar.jpg`)

      await fetch(`http://localhost:3000/avatar/upload`, {
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(response => {
        if(response.errors) {
          this.alert = { alert_type: 'error', alert_show: true, alert_text: response.errors}
        } else {
          this.alert = { alert_type: 'success', alert_show: true, alert_text: 'Avatar berhasil di upload.'}
        }
      })
      .catch(err => {
        this.alert = { alert_type: 'error', alert_show: true, alert_text: err.message}
      })
    },
    goToContact: function() {
      this.$router.push('contact')
    }
  },
  beforeMount() {
    this.find()
  }
}
</script>