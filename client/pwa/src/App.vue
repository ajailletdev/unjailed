<template>
  <v-app>
    <v-app-bar
        color="warn"
        dark
    >
      Bienvenue
      <v-spacer></v-spacer>
      <v-btn icon @click="loginLogout">
        <v-icon>
          mdi-login
        </v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
        centered>
          <v-tab to="/home">Home</v-tab>
          <v-tab to="/documents">Documents</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";
import authService from './services/auth-service';
import { User } from './entities/user.entity';

@Component({
  name: 'App',
})
export default class App extends Vue {

  public user: User | null = null;

  constructor () {
    super();
    authService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }

  public loginLogout (): void  {
    authService.logout();
  }
}
</script>

<style scoped>
  .app-bar-title {
    width: 500px;
  }
</style>
