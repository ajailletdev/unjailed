<template>
  <div class="documents">
    <shared-documents-list/>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import SharedDocumentsList from '../components/documents/SharedDocumentsList.vue'
import Component from "vue-class-component";


@Component({
  name: 'Documents',
  components: {
    SharedDocumentsList
  }
})
export default class Documents extends Vue {

}
</script>

<style scoped>
</style>