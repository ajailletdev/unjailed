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

    <v-dialog
        width="500"
        v-model="addDialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        color="primary"
        fab
        large
        dark
        fixed
        bottom
        right
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      </template>

      <add-document-dialog
       v-on:close-dialog="closeAddDialog"/>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import documentService from "../../services/document-service";
import { Document } from "../../entities/document.entity";
import AddDocumentDialog from './AddDocumentDialog.vue';
import DocumentDetails from './document/DocumentDetails.vue';
import InputWidget from '../shared/InputWidget.vue';
import DocumentWidget from './document/DocumentWidget.vue';
import { multiWordFilter } from '../../services/word-service';
import { Subscription } from "rxjs";

@Component({
  name: 'DocumentsList',
  components: {
    AddDocumentDialog,
    DocumentWidget,
    InputWidget
  }
})
export default class DocumentsList extends Vue {

    private allDocuments: Document [] = [];
    public documents: Document [] = [];
    public addDialog = false;

    public filterWord: string | null = null;
    private allDocuments$: Subscription;

    constructor () {
      super();
        this.allDocuments$ = documentService.documentsSubject.subscribe((docs) => {
            this.allDocuments = docs;
            this.setUpDocuments();
        });
    }

    public async mounted(): Promise<void> {
        await documentService.initAllDocument();
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