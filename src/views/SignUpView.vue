<template>
  <v-card :loading="loading" class="mx-auto my-12" min-width="374">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-card-title>Crear cuenta</v-card-title>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="fullName"
              :rules="nameRules"
              label="Nombre completo"
              required
            ></v-text-field>
          </v-col>
        </v-row>
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
              v-model="phone"
              :rules="phoneRules"
              label="Teléfono"
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
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="passwordConfirm"
              :rules="passwordRules"
              label="Confirmar contraseña"
              type="password"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Seleccione un avatar"
              prepend-icon="mdi-camera"
              label="Avatar"
              v-model="image"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="acceptConditions">
              <template v-slot:label>
                <div>
                  Acepto los
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <a
                        target="_blank"
                        href="https://vuetifyjs.com"
                        @click.stop
                        v-on="on"
                      >
                        Terminos y condiciones
                      </a>
                    </template>
                    Abre en una nueva ventana
                  </v-tooltip>
                </div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-card-actions>
      <v-btn :disabled="!valid" text @click="submit">
        Registrarme
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
          @click="closeSnackbar()"
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
    fullName: "",
    nameRules: [
      (v) => !!v || "El nombre es requerido",
      // (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+/.test(v) || "El E-mail debe ser valido",
    ],
    phone: "",
    phoneRules: [],
    password: "",
    passwordConfirm: "",
    passwordRules: [
      (v) => !!v || "La contraseña es requerida",
      (v) => v.length >= 6 || "La contraseña debe tener al menos 6 caracteres",
    ],
    image: null,
    avatar: null,
    acceptConditions: false,
  }),
  methods: {
      async submit () {
        const self = this
        await this.$refs.form.validate()
        this.loading = true
        if (this.image) this.avatar = this.getBase64(this.image)       
        if(this.valid) {
          this.loading = true
          const data = {
            name: this.fullName,
            email: this.email,
            phone: this.phone,
            password: this.password,
            c_password: this.passwordConfirm,
            avatar: this.avatar,
            ts_and_cs: this.acceptConditions,
          }
          const url = 'http://localhost:8000/api/register';
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
              self.snackbar.text = 'Se registro el usuario'
              self.snackbar.show = true
              self.success = true
            }
          });
        }
      },
      getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result);
          return reader.result
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
          return null
        };
      },
      closeSnackbar() {
        if (this.success) {
          this.$router.push('/signin')
        }
      }
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
