<template>
  <div>
  <input-widget v-on:valueChanged="filterDocuments"/>
  <div class="document-list">
    <document-widget
    v-for="doc in documents" v-bind:key="doc.id"
    v-bind:_document="doc"
    v-bind:_docUrl="doc"
    >
    </document-widget>
  </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import documentService from "../../services/document-service";
import { Document } from "../../entities/document.entity";
import AddDocumentDialog from './AddDocumentDialog.vue';
import InputWidget from '../shared/InputWidget.vue';
import DocumentWidget from './document/DocumentWidget.vue';
import { multiWordFilter } from '../../services/word-service';
import { Subscription } from "rxjs";

@Component({
  name: 'SharedDocumentsList',
  components: {
    AddDocumentDialog,
    DocumentWidget,
    InputWidget
  }
})
export default class SharedDocumentsList extends Vue {

    private allDocuments: Document [] = [];
    public documents: Document [] = [];
    
    public addDialog = false;

    public filterWord: string | null = null;
    private allDocuments$: Subscription;

    constructor () {
      super();
        this.allDocuments$ = documentService.documentsSharedWithMeSubject.subscribe((docs) => {
            this.allDocuments = docs;
            this.setUpDocuments();
        });
    }

    public async mounted(): Promise<void> {
        await documentService.initAllDocumentSharedWithMe();
    }

    public destroyed(): void {
      this.allDocuments$.unsubscribe();
    }

    // eslint-disable-next-line 
    public closeAddDialog (): void {    
        this.addDialog = false;
    }

    public filterDocuments = (value: string): void => {
        if (!value) this.filterWord = null;
        else this.filterWord = value;
        this.setUpDocuments();
    }

    private setUpDocuments = (): void => {
        this.documents.splice(0, this.documents.length);
        if (this.filterWord === null || this.filterWord === '') {
            this.documents.push(...this.allDocuments);
        }
        else {
            this.documents.push(...this.allDocuments.filter((doc) => multiWordFilter(this.filterWord.split(' '), doc.originalName.split(' '))));
        }
    }
}
</script>

<style scoped>
    .document-list {
        display: flex;
        padding: 10px;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }
</style>