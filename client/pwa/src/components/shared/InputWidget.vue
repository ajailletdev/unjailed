<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="searchWord"
            clearable
            label="Rechercher"
            @input="inputChange()"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: 'InputWidget',
})
export default class InputWidget extends Vue {
    public valid = true;
    public searchWord = "";

    public inputChange (): void {
        this.$emit('valueChanged', {
            value: this.searchWord,
        });
    }
}
</script>