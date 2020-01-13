<template>
  <v-footer dark padless absolute background-color="blue darken-2">
    <v-card
      flat
      tile
      width="100%"
      background-color="transparent"
      class="text-center">
      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>AREA</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  methods: {
  }
}
</script>
