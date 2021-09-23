<template>
  <v-app>
    <v-app-bar
        color="warn"
        flat
    >
      <p v-if="users[0]">
        Bienvenue {{users[0].login}}
      </p>
      <v-spacer></v-spacer>
      <v-btn v-if="!users[0]" text @click="loginLogout">
        Se connecter
      </v-btn>
      <v-btn v-if="users[0]" text @click="loginLogout">
        Se déconnecter
      </v-btn>

      <template v-slot:extension>
        <v-tabs>
          <v-tab to="/home">Home</v-tab>
          <v-tab v-if="users[0]" to="/documents">Mes Documents</v-tab>
          <v-tab v-if="users[0]" to="/shared_with_me">Partagés avec moi</v-tab>
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

  public users: User[] = [];

  constructor () {
    super();
    authService.userSubject.subscribe((user) => {
      while (this.users.length > 0) {
        this.users.pop();
      }
      this.user = user;
      this.users.push(user);
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

  .v-toolbar {
    flex: 0;
  }
</style>
