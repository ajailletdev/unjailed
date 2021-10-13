<template>
  <v-card>
        <v-card-title class="primary">
          Nouveau dossier
        </v-card-title>

        <v-card-text style="text-align: center">
              <input-widget 
              v-bind:_label="'Nom du dossier'"
              v-on:valueChanged="inputValueChanged"
              />
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
import InputWidget from "../../shared/InputWidget.vue";
import folderService from "../../../services/folder-service";

@Component({
  name: 'AddFolderDialog',
  components: {
      InputWidget
  }
})
export default class AddFolderDialog extends Vue {

    public value = "";
    public loading = false;

    public inputValueChanged(val: string): void {
        this.value = val.trim();
    }

    closeDialog(): void {
        this.$emit('close-dialog');
    }

    async saveDocument(): Promise<void> {
        if (this.value !== "") {
            this.loading = true;
            await folderService.createFolder(this.value);
            this.loading = false;   
        }
        
        this.$emit('close-dialog');
  }
}
</script>