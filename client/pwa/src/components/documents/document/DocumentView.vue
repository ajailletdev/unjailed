<template>
    <div v-if="watchDocument" class="document-frame">
        <iframe v-bind:src ="docUrl" style="width: 90%; height: 100%"></iframe>
        <v-btn
            color="accent"
            @click="closeDialog()"
            style="width: 90%"
          >
          Fermer
          </v-btn>
    </div>
</template>

<script lang='ts'>
import { Subscription } from 'rxjs';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Document } from "../../../entities/document.entity";

@Component({
  name: 'DocumentView',
  props: [
      '_document',
    ]
})
export default class DocumentView extends Vue {

    @Prop({required: true}) private _document: Document;
    private _docUrl: string | null = null;

    public watchDocument = false;

    private currentDocument$: Subscription;

    constructor () {
      super();
      this.setDocUrl(this.document);
    }

    public get document(): Document {
        return this._document;
    }

    public set document(doc: Document) {
        this._document = doc;
    }

    public get docUrl(): string {
        return this._docUrl;
    }

    public set docUrl(doc: string) {
        this._docUrl = doc;
    }

    closeDialog(): void {
        this.$emit('close-dialog');
    }

    private async setDocUrl(doc: Document): Promise<void> {
        this.docUrl = await doc.getPreviewUrl();
        this.watchDocument = true;
    }
}
</script>

<style scoped>
  .document-frame {
    position: fixed;
    top: 5%;
    bottom: 5%;
    left: 5%;
    right: 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>