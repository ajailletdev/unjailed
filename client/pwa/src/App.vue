<template>
  <v-app>
    <v-app-bar
        color="warn"
        dark
    >
      <h4 v-if="users[0]">
        {{users[0].login}}
      </h4>
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
</style>
