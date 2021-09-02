<template>
  <div>
  <input-widget v-on:valueChanged="filterDocuments"/>
  <div class="document-list">
        <v-card class="doc-card"
            color="indigo darken-4"
            v-for="doc in documents" v-bind:key="doc.id"
            elevation="2"
            >
            <v-card-subtitle>
                {{doc.originalName}}
            </v-card-subtitle>
            <v-card-text class="doc-card-text">
                {{doc.size/1000}} Ko
            </v-card-text>
            <v-card-actions>
                <v-btn
                icon
                color="primary"
                @click="displayDoc(doc)"
                >
                    <v-icon dark>
                        mdi-download
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                icon
                @click="openEditDialog(doc)"
                >
                    <v-icon dark>
                        mdi-dots-vertical
                    </v-icon>
            </v-btn>
            </v-card-actions>
        </v-card>
  </div>

    <v-dialog
        width="500"
        v-model="editDialog"
    >
        <document-details
        ref="documentDetails"
         v-on:close-dialog="closeEditDialog"/>
    </v-dialog>

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
import Vue from "vue";
import Component from "vue-class-component";
import documentService from "../../services/document-service";
import { Document } from "../../entities/document.entity";
import AddDocumentDialog from './AddDocumentDialog.vue';
import DocumentDetails from './DocumentDetails.vue';
import InputWidget from '../shared/InputWidget.vue';
import { multiWordFilter } from '../../services/word-service';

@Component({
  name: 'DocumentsList',
  components: {
    AddDocumentDialog,
    DocumentDetails,
    InputWidget
  }
})
export default class DocumentsList extends Vue {

    public allDocuments: Document [] = [];
    public documents: Document [] = [];
    public addDialog = false;
    public editDialog = false;
    public currentDocument: Document | null = null;

    public filterWord: string | null = null;

    public mounted(): void {
        this.setAllDocuments();
    }

    public async setAllDocuments(): Promise<void> {
        const docs = await documentService.findAllDocuments();
        if (docs) {
            this.allDocuments = docs;
            this.setUpDocuments();
        }
    }

    // eslint-disable-next-line 
    public closeAddDialog (res?: any): void {
        if (res?.addedDocs) {
            this.allDocuments.unshift(...res.addedDocs);
            this.setUpDocuments();
        }         
        this.addDialog = false;
    }

    public async displayDoc (adocument: Document): Promise<void> {
        const anchor = document.createElement("a");
        anchor.download = adocument.originalName;
        anchor.href = await (new Document(adocument)).getPreviewUrl();
        anchor.click();
        anchor.remove();
    }


    public openEditDialog(doc: Document): void {
        if (this.$refs.documentDetails === undefined) { //Tofix
            this.editDialog = true;
            setTimeout(() => {
            this.editDialog = false;
            this.openEditDialog(doc);
            }, 100);
        }
        else {
            documentService.setCurrentDocument(doc);
            this.currentDocument = doc;
            (this.$refs.documentDetails as DocumentDetails).changingCurrentDoc();
            this.editDialog = true;
        }
    }

    public closeEditDialog (res?:  string): void {  
        documentService.setCurrentDocument(null);
        if (res) {
            this.allDocuments = this.allDocuments.filter((doc) => doc.id !== res);
            this.setUpDocuments();
        }
        this.editDialog = false;
    }

    public filterDocuments(res: { value: string}): void {
        if (!res || ! res.value) this.filterWord = null;
        else this.filterWord = res.value;
        this.setUpDocuments();
    }

    private setUpDocuments(): void {
        if (this.filterWord === null || this.filterWord === '') {
            this.documents = [...this.allDocuments];
        }
        else {
            this.documents = this.allDocuments.filter((doc) => multiWordFilter(this.filterWord.split(' '), doc.originalName.split(' ')));
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

    .doc-card {
        width: 170px;
        margin: 5px;
        display: flex;
        flex-direction: column;
    }

    .doc-card-text {
        margin-top: auto;
    }
</style>