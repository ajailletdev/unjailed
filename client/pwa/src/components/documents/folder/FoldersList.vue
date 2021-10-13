<template>
<v-card>
    <v-card-title  v-if="dynamicCurrent[0]">
      <v-btn
        fab
        color="secondary"
        style="margin-right: 10px"
        small
        v-if="dynamicCurrent.length > 0"
        @click="onLocationBack()"
      >
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>
      /
      {{ dynamicCurrent[0] }}
   </v-card-title>
    <v-card-text style="display: flex;">
      <div style="flex: 1; display: flex; flex-wrap: wrap">
        <folder-widget
        v-for="folder in folders" v-bind:key="folder.id"
        v-bind:_folder="folder"
        ></folder-widget>
      </div>
      <v-btn
        color="accent"
        large
        style="flex-shrink: 0; margin-bottom: auto"
        v-if="dynamicCurrent.length > 0 && folders.length === 0 && this.documents.length === 0"
        @click="onDeleteFolder()"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import folderService from '../../../services/folder-service';
import { Folder } from '../../../entities/folder.entity';
import { Document } from '../../../entities/document.entity';
import { Subscription } from 'rxjs';
import FolderWidget  from './FolderWidget.vue';
import router from '../../../router';
import documentService from '../../../services/document-service';

@Component({
  name: 'FolderList',
  components: {
    FolderWidget,
  }
})
export default class FolderList extends Vue {

  public dynamicCurrent: string[] = [];

  public currentFolder: Folder | null =  null;
  private currentFolder$: Subscription;

  public folders: Folder[] = [];
  private folders$: Subscription;

  public documents: Document[] = [];
  private documents$: Subscription;

  constructor () {
    super();
    this.currentFolder$ = folderService.currentfolderSubject.subscribe(async (folder) => {
      this.dynamicCurrent.pop();
      this.currentFolder = folder;
      if (router.currentRoute.query.location as string) this.dynamicCurrent.push((router.currentRoute.query.location as string).split(';').join(' / '));
      await folderService.setFoldersFromCurrent();
    });

    this.folders$ = folderService.foldersSubject.subscribe((folders) => {
      this.setFolders(folders);
    });

    this.documents$ = documentService.documentsSubject.subscribe((docs) => {
      this.setDocuments(docs);
    });

    this.initComponent();
  }

  public async initComponent(): Promise<void> {
    if (router.currentRoute.query.location) folderService.setCurrentFromLocation(router.currentRoute.query.location as string);
    else await folderService.initializeCurrentFolder();
  }

  public destroy(): void {
    this.currentFolder$.unsubscribe();
    this.folders$.unsubscribe();
    this.documents$.unsubscribe();
  }
  
  @Watch('$route')
  // eslint-disable-next-line
  public routeHasChange(newValue: any): void {
    if (newValue.path === '/documents') {
      if (newValue.query.location) {
        const location = newValue.query.location;
        folderService.setCurrentFromLocation(location);
      }
      else {
        folderService.initializeCurrentFolder();
      }
    }
  }

  private setFolders(folders: Folder[]) {
    this.folders.splice(0, this.folders.length);
    this.folders.push(...folders);
  }

  private setDocuments(docs: Document[]) {
    this.documents.splice(0, this.documents.length);
    this.documents.push(...docs);
  }


  public async onDeleteFolder(): Promise<void> {
    await folderService.deleteCurrentFolder();
    router.back();
  }

  public onLocationBack(): void {
    router.back();
  }
}
</script>

<style scoped>
  .main-folder-list {
    padding: 10px;
  }
</style>