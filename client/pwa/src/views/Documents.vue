<template>
  <div class="documents">

    <documents-list/>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import DocumentsList from '../components/documents/DocumentsList.vue'
import Component from "vue-class-component";


@Component({
  name: 'Documents',
  components: {
    DocumentsList
  }
})
export default class Documents extends Vue {

}
</script>

<style scoped>
</style>