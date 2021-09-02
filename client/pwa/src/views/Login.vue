<template>
  <v-app id="inspire">
      <v-main>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Connexion</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              v-model="login"
                              prepend-icon="person"
                              name="login"
                              label="Login"
                              type="text"
                           ></v-text-field>
                           <v-text-field
                              v-model="password"
                              id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Mot de passe"
                              type="password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="onLogin()">Se connecter</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-main>
   </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";
import authService  from '../services/auth-service';

@Component({
  name: 'Login',
})
export default class Login extends Vue {
    public login = "";
    public password = "";

    public async onLogin(): Promise<void> {
        await authService.onLogin(this.login, this.password);
    }
}
</script>