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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import documentService from "../../../../services/document-service";
import authService from "../../../../services/auth-service";
import userService from "../../../../services/user-service";
import { Document } from "../../../../entities/document.entity";
import { User } from "../../../../entities/user.entity";
import { Subscription } from "rxjs";

@Component({
  name: 'EditDocumentViewers',
  props: ['_document']
})
export default class EditDocumentViewers extends Vue {

  @Prop({required: true}) private _document: Document;

  public users: User[] = [];
  private authentificateUser: User | null = null;
  private authentificateUser$: Subscription;

  public loginSelected: string[] = [];

  public get document(): Document {
    return this._document;
  }
  public set document (doc: Document) {
    this._document = doc;
  }

  constructor () {
    super();

    this.authentificateUser$ = authService.userSubject.subscribe((user) => {
      this.authentificateUser = user;
    });
    authService.emitUser();
  }

  @Watch('document')
  private documentChange(): void {
    this.setUpSelected();
  }

  async mounted(): Promise<void> {
    this.users = (await userService.getUsers()).filter((us) => us.id !== this.authentificateUser?.id);
    this.setUpSelected();
  }
  

  closeDialog(): void {
    this.$emit('close-dialog');
  }
 
  destroy (): void {
    this.authentificateUser$.unsubscribe();
  }

  async checkboxChanged(user: User): Promise<void> {
    await documentService.manageCurrentDocumentViewer(user, this.document);
  }

  setUpSelected = (): void => {
    this.loginSelected.splice(0, this.loginSelected.length);
    this.loginSelected.push(...this.document.viewers.map((acc) => acc.user.login));
  }
}
</script>

<style scoped>
  .no-editable {
    margin-left: 12px
  }
</style>