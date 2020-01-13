<template>
  <v-container>

    <AppBar/>

    <AppFooter/>

  </v-container>
</template>

<script>

import AppBar from '../components/app-bar/app-bar.vue'
import AppFooter from '../components/app-footer/app-footer.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    AppBar,
    AppFooter,
  },
  methods: {
  }
}

</script>
