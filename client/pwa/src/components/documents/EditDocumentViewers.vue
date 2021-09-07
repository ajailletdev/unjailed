<template>
  <v-card>
        <v-card-title class="primary">
          Ayant accès
          <v-spacer></v-spacer>
          <v-btn
            color="accent"
            fab
            small
            @click="closeDialog()"
          >
          <v-icon>
            mdi-close
          </v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-checkbox
            v-for="user in users" v-bind:key="user.login"
            :input-value="loginSelected"
            :label="user.login"
            :value="user.login"
            @change="checkboxChanged(user)"
          ></v-checkbox>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import documentService from "../../services/document-service";
import userService from "../../services/user-service";
import { Document } from "../../entities/document.entity";
import { User } from "../../entities/user.entity";
import { Subscription } from "rxjs";

@Component({
  name: 'EditDocumentViewers',
})
export default class EditDocumentViewers extends Vue {
  
  public document: Document | null = null;
  public users: User[] = [];

  private document$: Subscription;
  public selected: User[] = [];
  public loginSelected: string[] = [];

  constructor () {
    super();
    this.document$ = documentService.currentDocumentSubject.subscribe(async (doc) => {
      this.clearLoginSelected(this.loginSelected);
      this.users = await userService.getUsers();
      this.document = doc;
      if (doc) {
        this.selected = this.users.filter((us) => {
          return doc.viewers.findIndex((acc) => acc.userId === us.id) > -1
        });
        this.loginSelected.push(...this.selected.map((us) => us.login));
      }
    });
    documentService.emitCurrentDocument();
  }
  
  async mounted(): Promise<void> {
    while (this.loginSelected.length > 0) {
        this.loginSelected.pop();
    }
    this.users = await userService.getUsers();
  }

  closeDialog(): void {
    this.$emit('close-dialog');
  }

  destroy (): void {
    this.document$.unsubscribe();
  }

  async checkboxChanged(user: User): Promise<void> {
    await documentService.manageCurrentDocumentViewer(user);
  }

  clearLoginSelected (selected: string[]): void {
    while (selected.length > 0) {
      selected.pop();
    }
  }
}
</script>

<style scoped>
  .no-editable {
    margin-left: 12px
  }
</style>