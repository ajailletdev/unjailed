<template>
    <div>
        <v-card class="doc-card"
            elevation="2"
        >   
               
            <v-card-text>
                <!-- TODO iFRAME -->
                <!-- <iframe v-bind:src ="docUrl"></iframe> -->
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="doc-card-text"
                        v-bind="attrs"
                        v-on="on">
                            {{document.originalName}}
                        </div>
                    </template>
                    {{document.originalName}}
                </v-tooltip>
                <div>
                    Accès:
                    <span v-for="acc of document.viewers" v-bind:key="acc.id">
                        {{ acc.user.login }}
                    </span>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn
                icon
                color="primary"
                @click="displayDoc()"
                >
                    <v-icon dark>
                        mdi-download
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                icon
                @click="openViewDialog()"
                >
                    <v-icon dark>
                        mdi-eye
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                icon
                @click="openEditDialog()"
                >
                    <v-icon dark>
                        mdi-dots-vertical
                    </v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog
            width="500"
            v-model="editDialog"
        >
            <document-details
            v-bind:_document="document"
            v-on:close-dialog="closeEditDialog"/>
        </v-dialog>

        <v-dialog
            v-model="viewDialog"
        >
            <document-view
            v-bind:_document="document"
            v-on:close-dialog="closeViewDialog"/>
        </v-dialog>
    </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import documentService from "../../../services/document-service";
import { Document } from "../../../entities/document.entity";
import AddDocumentDialog from '../AddDocumentDialog.vue';
import DocumentDetails from './DocumentDetails.vue';
import DocumentView from './DocumentView.vue';


@Component({
  name: 'DocumentWidget',
  components: {
    AddDocumentDialog,
    DocumentDetails,
    DocumentView
  },
  props: [
      '_document',
      '_docUrl'
    ]
})
export default class DocumentWidget extends Vue {

    @Prop({required: true}) public _document: Document;
    @Prop({required: true}) private _docUrl: string;

    public editDialog = false;
    public viewDialog = false;


    public get docUrl(): string {
        return this._docUrl;
    }

    public set docUrl(url: string) {
        this._docUrl = url;
    }

    public get document(): Document {
        return this._document;
    }

    public set document(doc: Document) {
        this._document = doc;
    }

    public async displayDoc (): Promise<void> {
        const anchor = document.createElement("a");
        anchor.download = this.document.originalName;
        anchor.href = await this.document.getPreviewUrl();
        anchor.click();
        anchor.remove();
    }


    public openEditDialog(): void {
        documentService.setCurrentDocument(this.document);
        this.editDialog = true;        
    }

    public closeEditDialog (): void {  
        documentService.setCurrentDocument(null);
        this.editDialog = false;
    }

    public openViewDialog(): void {
        documentService.setCurrentDocument(this.document);
        this.viewDialog = true;        
    }

    public closeViewDialog (): void {  
        documentService.setCurrentDocument(null);
        this.viewDialog = false;
    }
}
</script>

<style scoped>
    .doc-card {
        width: 150px;
        margin: 5px;
        display: flex;
        flex-direction: column;
    }

    .doc-card-text {
        margin-top: auto;
        white-space:nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>