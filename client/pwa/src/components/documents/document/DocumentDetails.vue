<template>
  <v-card>
        <v-card-title class="primary">
          Modification
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

        <v-card-text v-if="document">
          <div>
          <v-form v-model="filenameValid">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-text-field
                      v-model="editableFilename"
                      :rules="filenameRules"
                      label="Nom du fichier"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
          </v-form>
          </div>
          <div style="display: flex">
            <div style="flex: 1">
              <div class="no-editable">
                Type: {{document.mime}}
              </div>
              <div class="no-editable">
                Taille: {{document.size/1000}} kO
              </div>
              <div class="no-editable">
                Date d'import: {{getLocaleDate(document.createdAt)}}
              </div>
            </div>
            <div style="flex: 1; display: flex; justify-content: flex-end; align-items: flex-end">
              <v-btn
                color="primary"
                fab
                small
                @click="openEditViewersDialog"        
              >
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-text>

        <v-dialog
          width="300"
          v-model="editDocumentViewers"
        >
          <edit-document-viewers
          v-on:close-dialog="closeEditViewersDialog"
          v-bind:_document="document"/>
        </v-dialog>

        <v-card-actions>
          <v-dialog
                width="500"
                v-model="confirmDialog"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="accent"
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
              </template>
              <confirm-dialog
              v-on:close-dialog="closeConfirmDialog"/>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!filenameValid"
            text
            @click="saveFilenameDocument()"
          >
          Valider les changements
          </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import documentService from "../../../services/document-service";
import dateService from "../../../services/date-service";
import { Document } from "../../../entities/document.entity"
import ConfirmDialog from '../../shared/ConfirmDialog.vue';
import EditDocumentViewers from './document-actions/EditDocumentViewers.vue';

@Component({
  name: 'DocumentDetails',
  components: {
    ConfirmDialog,
    EditDocumentViewers
  },
  props: ['_document']
})
export default class DocumentDetails extends Vue {
  
  @Prop({required: true}) public _document: Document;
  public editableFilename = "";
  public confirmDialog = false;
  public filenameValid = false;
  public editDocumentViewers = false;

  public filenameRules = [
    // eslint-disable-next-line
    (v: any) => !!v || 'Name is required'
  ]

  constructor () {
    super();
    this.editableFilename = this.document.originalName;
  }

  @Watch('document')
  private documentChange(): void {
    this.editableFilename = this.document.originalName;
  }

  public get document(): Document {
    return this._document;
  }

  public set document(doc: Document) {
    this._document = doc;
    this.editableFilename = this.document.originalName;
  }

  getLocaleDate(date: Date): string {
    return dateService.convertToFrLocale(date);
  }
 
  closeDialog(): void {
    this.$emit('close-dialog');
  }

  async saveFilenameDocument(): Promise<void> {
    await this.document.changeFilename(this.editableFilename);
    this.$emit('close-dialog');
  }

  async closeConfirmDialog(res: { valid: boolean }): Promise<void> {
    if (res.valid) {
      this.confirmDialog = false;
      await documentService.deleteDocument(this.document.id);
      this.closeDialog();
    }
    else this.confirmDialog = false;
  }

  closeEditViewersDialog(): void {
    this.editDocumentViewers = false;
  }

  openEditViewersDialog(): void {
    this.editDocumentViewers = true;
  }
}
</script>

<style scoped>
  .no-editable {
    margin-left: 12px
  }
</style>