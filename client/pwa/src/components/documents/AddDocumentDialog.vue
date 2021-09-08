<template>
  <v-card>
        <v-card-title class="primary">
          Ajout d'un document
        </v-card-title>

        <v-card-text>
        <v-file-input
            v-model="files"
            counter
            multiple
            show-size
            truncate-length="15"
            label="Choisir un fichier"
        ></v-file-input>
        </v-card-text>

        <v-divider></v-divider>

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
            :loading="loading"
            :disabled="files.length === 0"
            text
            @click="saveDocument()"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import documentService from "../../services/document-service";


@Component({
  name: 'AddDocumentDialog',
})
export default class AddDocumentDialog extends Vue {
  files = [];
  loading = false;

  data!: () => ({
    files: []
  })

  closeDialog(): void {
    this.$emit('close-dialog');
  }

  async saveDocument(): Promise<void> {
      this.loading = true;
      await documentService.postDocuments(this.files);
      this.files = [];
      this.loading = false;
      this.$emit('close-dialog');
  }
}
</script>