<template>
  <v-container fill-height fluid class="not-found-background" style="max-height: 100vh;">

    <v-layout justify-center align-center column pa-5>
      <div
        class="display-4 font-weight-black white--text text-xs-center mb-3">
        404
      </div>
      <div class="display-1 font-weight-bold white--text text-xs-center">
        Hey, it seems that you're lost bro.
      </div>
      <div class="display-1 font-weight-bold white--text text-xs-center">
        <v-btn text dark @click="navigateTo('home')">
          Home page
        </v-btn>
      </div>
    </v-layout>

  </v-container>
</template>

<script>
    export default {
        name: "not-found",
        methods: {
            navigateTo (route) {
                this.$router.push({
                    name: route
                })
            },
        }
    }
</script>

<style scoped>

  .not-found-background {
    background:
      radial-gradient(transparent, white),
      url('https://images.unsplash.com/photo-1563301141-3fb8b3b2df9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80');
    background-size: cover;
    width: 100%;
    height: 100%;
    background-blend-mode: saturation;
  }

</style>