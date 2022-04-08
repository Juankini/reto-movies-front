<template>
  <div class="pa-6">
      <h1 class="text-center">Popular Movies</h1>
        <v-data-table
            :headers="headers"
            :items="movies"
            :items-per-page="5"
            class="elevation-1"
        >
            <template v-slot:item.poster="{ item }">
            <img :src="item.poster" style="width: auto; height: 100px" />
            </template>
            <template v-slot:item.title="{ item }">
            <router-link :to="`/movie/${item.id}`">{{ item.title }}</router-link>
            </template>
            <template v-slot:item.vote_average="{ item }">
            <v-chip class="ma-2" color="warning" outlined>
                <v-icon left> mdi-star </v-icon>
                    {{ item.vote_average }}
            </v-chip>
            </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    valid: false,
    cast: null,
    basePathImages: "https://image.tmdb.org/t/p/original",
    headers: [
      { text: "Poster", value: "poster" },
      {
        text: "Title",
        align: "start",
        sortable: false,
        value: "title",
      },
      {
        text: "Average",
        align: "start",
        sortable: false,
        value: "vote_average",
      },
    ],
    movies: [
    ],
  }),
  created() {
    const self = this;
    fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=e7e9ddbba6344ade38deaf2d405eb5a6&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=rent"
    )
      .then((response) => response.json())
      .then((data) => {
        self.movies = data.results;
        self.movies.forEach((element) => {
          element.poster = self.basePathImages + element.poster_path;
        });
        console.log(self.movies);
        // self.loading = false
      });
  },
  methods: {
    async submit() {
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
