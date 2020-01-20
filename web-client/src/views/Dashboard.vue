<template>
  <v-container fill-height fluid>

    <AppBar/>

    <AppFooter/>

  </v-container>
</template>

<script>
    import AppBar from "../components/app-bar/app-bar";
    import AppFooter from "../components/app-footer/app-footer";

    export default {
        name: "Dashboard",
        components: {
            AppBar,
            AppFooter,
        }
    }
</script>

<style scoped>

</style>