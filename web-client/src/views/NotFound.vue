<template>
  <v-container fill-height fluid>

    <AppBar/>

    <NotFound/>

    <AppFooter/>

  </v-container>
</template>

<script>
    import AppBar from "../components/app-bar/app-bar";
    import AppFooter from "../components/app-footer/app-footer";
    import NotFound from "../components/not-found/not-found";

    export default {
        name: "notFound",
        components: {
            AppBar,
            AppFooter,
            NotFound
        }
    }
</script>

<style scoped>

</style>