<template>
<v-card>
    <v-card-title  v-if="dynamicCurrent[0]">
      {{ dynamicCurrent[0] }}
    </v-card-title>
    <v-card-text style="display: flex">
      <folder-widget
        v-for="folder in folders" v-bind:key="folder.id"
        v-bind:_folder="folder"
      ></folder-widget>
    </v-card-text>
  </v-card>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import folderService from '../../../services/folder-service';
import { Folder } from '../../../entities/folder.entity';
import { Subscription } from 'rxjs';
import FolderWidget  from './FolderWidget.vue';
import router from '../../../router';

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

  constructor () {
    super();
    this.currentFolder$ = folderService.currentfolderSubject.subscribe(async (folder) => {
      this.dynamicCurrent.pop();
      this.currentFolder = folder;
      // console.log(router.currentRoute.query.location)
      // if (router.currentRoute.query.location) this.dynamicCurrent.push(router.currentRoute.query.location as string);
      await folderService.setFoldersFromCurrent();
    });
    this.folders$ = folderService.foldersSubject.subscribe((folders) => {
      this.setFolders(folders);
    });
    this.initComponent();
  }

  public async initComponent(): Promise<void> {
    if (folderService.getCurrentfolder() === null) {
      await folderService.initializeCurrentFolder();
    }
    else folderService.emitCurrentFolder();
  }

  public destroyed(): void {
    this.currentFolder$.unsubscribe();
    this.folders$.unsubscribe();
  }
  
  @Watch('$route')
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

}
</script>

<style scoped>
  .main-folder-list {
    padding: 10px;
  }
</style>