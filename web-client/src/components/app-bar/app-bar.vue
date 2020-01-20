<template>
  <v-app-bar flat app dark color="gray">
    <v-app-bar-title>
      <v-btn text @click="navigateTo('home')">[B-DEV-510] - Area</v-btn>
    </v-app-bar-title>

    <v-spacer/>

    <v-menu
      v-if="isLoggedIn"
      :offset-y="true">
      <template
        v-slot:activator="{ on }">
        <v-btn
          v-on="on">
          <span>Your account</span>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          @click="logOut">
          <v-list-item-title>
            Log out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      v-if="!isLoggedIn"
      @click="navigateTo('authentication')">
      Wanna use your personnal A/REA ?
    </v-btn>

  </v-app-bar>
</template>

<script>
export default {
  data () {
    return {
      isLoggedIn: this.$store.state.isUserLoggedIn
    }
  },
  methods: {

    navigateTo (route) {
      this.$router.push({
        name: route
      })
    },

    logOut () {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.navigateTo('authentication')
    }

  }
}
</script>