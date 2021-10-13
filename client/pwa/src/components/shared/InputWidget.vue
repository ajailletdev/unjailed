<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="searchWord"
            clearable
            :label="label"
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
import { Prop } from "vue-property-decorator";

@Component({
  name: 'InputWidget',
  props: [
    '_label',
  ]
})
export default class InputWidget extends Vue {
    public valid = true;
    public searchWord = "";

    @Prop() public _label?: string;

    public get label(): string {
      if(!this._label) return "Rechercher";
      else return this._label;
    }

    public set label(label: string) {
      this._label = label;
    }
    
    public inputChange (): void {
      this.$emit('valueChanged', this.searchWord);
    }
}
</script>