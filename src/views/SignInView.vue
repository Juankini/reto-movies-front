<template>
  <v-card :loading="loading" class="mx-auto my-12" min-width="374">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-card-title>Inicio de sesion</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Contraseña"
              type="password"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-card-actions>
      <v-btn :disabled="!valid" text @click="submit">
        Ingresar
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    valid: false,
    snackbar: {
      text: "",
      show: false
    },
    success: false,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+/.test(v) || "El E-mail debe ser valido",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "La contraseña es requerida",
      (v) => v.length >= 6 || "La contraseña debe tener al menos 6 caracteres",
    ],
  }),
  methods: {
      async submit () {
        const self = this
        await this.$refs.form.validate()
        if(this.valid) {
          this.loading = true
          const data = {
            email: this.email,
            password: this.password
          }
          const url = 'http://localhost:8000/api/login';
          fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .catch(error => {
            console.error('Error:', error)
            self.snackbar.text = 'Ocurrio un error'
            self.snackbar.show = true
            self.success = false
          })
          .then(response => {
            console.log('Success:', response)
            if (response.success) {
              localStorage.setItem('user', JSON.stringify(response.data));
              this.$router.push('/movies')
              location.reload();
              // self.snackbar.text = 'Se registro el usuario'
              // self.snackbar.show = true
              // self.success = true
            }
          });
        }
      },
    },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
