<template>
  <div class="documents">
    <folders-list/>
    <documents-list/>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import DocumentsList from '../components/documents/DocumentsList.vue';
import FoldersList from '../components/documents/folder/FoldersList.vue';
import Component from "vue-class-component";


@Component({
  name: 'Documents',
  components: {
    DocumentsList,
    FoldersList
  }
})
export default class Documents extends Vue {

}
</script>

<style scoped>
</style>