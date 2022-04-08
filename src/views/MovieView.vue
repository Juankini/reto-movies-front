<template>
  <v-card :loading="loading" class="mx-auto my-12" min-width="374" max-width="574">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-img class="movie-img"
      :src="movie ? basePathImages + movie.poster_path : ''"
    ></v-img>
    <v-card-title>{{ movie?.title}}</v-card-title>

    <v-card-actions>
      <v-btn text @click="submit" :color="favorite ? 'light': 'pink'">
            <v-icon left>
                {{ favorite ? 'mdi-heart-outline' : 'mdi-heart' }} 
            </v-icon>
        {{ favorite ? 'Remover de favoritas' : 'Añadir a favorita' }} 
        </v-btn>
    </v-card-actions>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-rating
          :value="movie?.vote_average"
          length="10"
          color="amber"
          background-color="gray"
          dense
          half-increments
          readonly
          size="14"
        ></v-rating>

        <div class="grey--text ms-4">
          {{ movie?.vote_average }} ({{ movie?.vote_count }})
        </div>
      </v-row>

      <div class="my-4 text-subtitle-1">
        Release date: {{ movie?.release_date }}
      </div>

      <div>{{ movie?.overview }}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Genres</v-card-title>

    <v-card-text>
      <v-chip-group
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip v-for="item in movie?.genres" :key="item.id">{{ item?.name}}</v-chip>
      </v-chip-group>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Spoken languages</v-card-title>

    <v-card-text>
      <v-chip-group
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip v-for="item in movie?.spoken_languages" :key="item.iso_639_1">{{ item?.english_name}}</v-chip>
      </v-chip-group>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Casting</v-card-title>

    <v-card-text>
      <v-chip
        v-for="item in cast" :key="item.id"
        class="ma-2"
        color="light"
        label
        >
        <v-icon left>
            mdi-account-circle-outline
        </v-icon>
            {{ item?.name}}
        </v-chip>
    </v-card-text>
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
        loading: true,
        valid: false,
        snackbar: {
          text: "",
          show: false
        },
        success: false,
        movie: null,
        cast: null,
        basePathImages: 'https://image.tmdb.org/t/p/original',
        user: null,
        favorite: false
        // id: this.$route.params.id
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
    },
    created() {
      const self = this
      this.user = JSON.parse(localStorage.getItem('user'));
      fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.id}?api_key=e7e9ddbba6344ade38deaf2d405eb5a6`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            self.movie = data
            self.loading = false
        });
      fetch(`http://localhost:8000/api/movie?movie=${this.$route.params.id}&?user=${this.user.id}`)
        .then(response => response.json())
        .then(data => {
            console.log('FAVORITE', data)
            if( data.success) {
              self.favorite = data.data.favorite
            }
            
            // self.movie = data
            // self.loading = false
        });
      fetch(`https://api.themoviedb.org/3/movie/${this.$route.params.id}/credits?api_key=e7e9ddbba6344ade38deaf2d405eb5a6&language=en-US`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            self.cast = data.cast
            self.loading = false
        });
    
    },
    methods: {
        async submit() {
          const self = this
          let genres = this.movie.genres.map(function(elem){
              return elem.name;
          }).join(",")

          let cast = this.cast.map(function(elem){
              return elem.name;
          }).join(",")

          let spoken_languages = this.movie.spoken_languages.map(function(elem){
              return elem.name;
          }).join(",")

          const request = {
            user_id: this.user.id,
            movie_id: this.movie.id,
            title: this.movie.title,
            description: this.movie.overview,
            genres: genres,
            released_at: this.movie.release_date,
            vote_average: this.movie.vote_average,
            vote_count: this.movie.vote_count,
            poster_path: this.movie.poster_path,
            spoken_languages: spoken_languages,
            cast: cast,
            favorite: true
          }
          console.log(request)

          const url = 'http://localhost:8000/api/movie';
          fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(request), // data can be `string` or {object}!
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
              self.snackbar.text = 'Se agregó a favoritos'
              self.snackbar.show = true
              self.success = true

            }
          });
        // await this.$refs.form.validate();
        // if (this.valid) {
        //     this.loading = true;
        //     setTimeout(() => (this.loading = false), 2000);
        // }
        },
    },
};
</script>

<style>
.movie-img {
    width: 100%;
    height: auto;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
