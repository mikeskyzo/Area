<template>
  <v-container fill-height fluid>

    <AppBar/>

    {{error}}

  <v-container fill-height fluid
    class="grey lighten-2">
    <v-container
      :padding="4"
      align-center>
      <v-card
        :elevation="10"
        :ma="5"
        :padding="4">
        <v-row>

          <v-col v-if="ActiveView === 'SignIn'" class="grey darken-3">
            <v-container fluid fill-height>
              <v-container align-center>
                <v-sheet
                  class="transparent"
                  align="center"
                  :margin="4"
                  :elevation="0">
                  <form
                    name="SignInForm"
                    autocomplete="on">

                    <v-text-field
                      background-color="transparent"
                      color="orange"
                      label="Email"
                      v-model="email"
                      :hint="`exemple: john.doe@epitech.eu`"
                      outlined
                      clearable/>

                    <v-text-field
                      label="Password"
                      type="password"
                      v-model="password"
                      :max-width="40"
                      :hint="`Must only contains the followings : lower case alphabetical characters, upper case alphabetical characters, numerical characters`"
                      :counter="32"
                      outlined
                      clearable
                      background-color="transparent"
                      color="orange"/>

                  </form>

                  <div v-html="signInError"/>

                  <v-btn text-center dark rounded color="orange accent-2" x-large @click="login">Sign in</v-btn>

                </v-sheet>
              </v-container>
            </v-container>
          </v-col>

          <v-col
            class="text-center blue accent-2">
            <v-container class="text-center"
              fluid fill-height>

              <v-container
                align-center>
                <v-card
                  dark
                  :elevation="0"
                  color="transparent"
                  v-if="ActiveView === 'SignIn'">
                  <v-card-text>
                    <h2>Ahoy !<br>Newbie in sight!</h2>
                    <p>Prepare yourself for a great journey !<br>Provide your personal data here to join us</p>
                  </v-card-text>
                  <v-btn dark rounded outlined x-large @click="switchActive">
                    Sign Up
                  </v-btn>
                </v-card>
              </v-container>

              <v-container
                align-center>
                <v-card
                  dark
                  :elevation="0"
                  color="transparent"
                  v-if="ActiveView === 'SignUp'">
                  <v-card-text>
                    <h2>Welcome back,<br>old friend !</h2>
                    <p>Wanna sign in<br>to your dashboard ?</p>
                  </v-card-text>
                  <v-btn
                    dark rounded outlined x-large @click="switchActive">
                    Sign in
                  </v-btn>
                </v-card>
              </v-container>

            </v-container>
          </v-col>

          <v-col
            v-if="ActiveView === 'SignUp'">
            <v-container fluid fill-height>
              <v-container align-center>
                <v-sheet
                  align="center"
                  :margin="4"
                  :elevation="0">
                  <form
                    name="SignUpForm"
                    autocomplete="off">

                    <v-text-field
                      label="Username"
                      v-model="username"

                      :margin="3"
                      outlined
                      clearable/>

                    <v-text-field
                      label="Email"
                      v-model="email"

                      autocomplete="new-password"
                      :hint="`exemple: john.doe@epitech.eu`"
                      outlined
                      clearable/>

                    <v-text-field
                      label="Password"
                      type="password"
                      v-model="password"

                      :max-width="40"
                      :hint="`Must only contains the followings : lower case alphabetical characters, upper case alphabetical characters, numerical characters`"
                      :counter="32"
                      outlined
                      clearable/>

                  </form>

                  <div v-html="signUpError"/>

                  <v-btn text-center dark rounded color="blue accent-2" x-large @click="register">Sign up</v-btn>

                </v-sheet>
              </v-container>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-container>

    <AppFooter/>

  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import AppBar from '../components/app-bar/app-bar.vue'
import AppFooter from '../components/app-footer/app-footer.vue'

export default {
  data () {
    return {

      ActiveView: 'SignUp',

      username: '',
      email: '',
      password: '',

      error: '()',

      signUpError: null,
      signInError: null,

    }
  },
  components: {
    AppBar,
    AppFooter
  },
  methods: {

    switchActive () {
      this.ActiveView = (this.ActiveView === 'SignUp') ? 'SignIn' : 'SignUp'
    },

    async register () {
      try {
        this.error = 'Trying to register';
        const response = await AuthenticationService.register({
          username: this.email,
          password: this.password
        });
        this.error = '(has a response)';
          // eslint-disable-next-line no-console
        this.signUpError = null;
        //await this.$store.dispatch('setToken', /*response.data.token*/);
        await this.$store.dispatch('setUser', {} /*response.data.user*/);
        await this.$router.push({
          name: 'home'
        });
      } catch (error) {
        this.signUpError = error.response.data.error
      }
    },

    async login () {
      try {
        /*
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        */
        this.signInError = null;
        //await this.$store.dispatch('setToken', /*response.data.token*/);
        await this.$store.dispatch('setUser', {}/*response.data.user*/);
        await this.$router.push({
          name: 'home'
        });
      } catch (error) {
        this.signInError = error.response.data.error
      }
    }

  }
}
</script>
