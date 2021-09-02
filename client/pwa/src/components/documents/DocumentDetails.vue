<template>
  <v-card>
        <v-card-title class="primary">
          Modification d'un document
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text v-if="document !== null">
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
            </div>
          </div>
        </v-card-text>


        <v-card-actions>
          <v-btn
            color="accent"
            text
            @click="closeDialog()"
          >
            Fermer
          </v-btn>
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
import Vue from "vue";
import Component from "vue-class-component";
import documentService from "../../services/document-service";
import dateService from "../../services/date-service";
import { Document } from "../../entities/document.entity"
import ConfirmDialog from '../shared/ConfirmDialog.vue';

@Component({
  name: 'DocumentDetails',
  components: {
    ConfirmDialog
  }
})
export default class DocumentDetails extends Vue {

  public document: Document | null = null;
  public editableFilename = "";
  public confirmDialog = false;
  public filenameValid = false;
  public filenameRules = [
    // eslint-disable-next-line
    (v: any) => !!v || 'Name is required'
  ]
  
  changingCurrentDoc(): void {
    this.document = documentService.getCurrentDocument();
    if (this.document !== null) this.editableFilename = this.document.originalName;
  }

  getLocaleDate(date: Date): string {
    return dateService.convertToFrLocale(date);
  }
 
  closeDialog(deleted?: string): void {
    this.$emit('close-dialog', deleted);
  }

  async saveFilenameDocument(): Promise<void> {
    if (this.document) {
      await this.document.changeFilename(this.editableFilename);
    }
    this.$emit('close-dialog');
  }

  async closeConfirmDialog(res: { valid: boolean }): Promise<void> {
    if (res.valid && this.document && this.document.id) {
      this.confirmDialog = false;
      const deletedDoc = await documentService.deleteDocument(this.document.id);
      if (deletedDoc)
        this.closeDialog(this.document.id);
    }
    else this.confirmDialog = false;
  }
}
</script>

<style scoped>
  .no-editable {
    margin-left: 12px
  }
</style>