<template>
  <v-card>
        <v-card-title class="primary">
          Confirmation
        </v-card-title>

        <v-card-text>
            Êtes vous sur?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="accent"
            text
            @click="closeDialog(false)"
          >
            Non
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeDialog(true)"
          >
            oui
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: 'ConfirmDialog',
})
export default class ConfirmDialog extends Vue {

  closeDialog(bool: boolean): void {
    this.$emit('close-dialog', {
        valid: bool
    });
  }
}
</script>