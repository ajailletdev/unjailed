<template>
    <v-card style="width: 200px; margin: 10px; cursor: pointer" color="secondary" @click="changeCurrentFolder()">
        <v-card-title style="justify-content: space-between; flex-wrap: nowrap">
            <v-icon style="margin-right: 10px">
                mdi-folder
            </v-icon>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <div class="doc-card-text"
                    v-bind="attrs"
                    v-on="on">
                        {{folder.name}}
                    </div>
                </template>
                {{folder.name}}
            </v-tooltip>
        </v-card-title>
    </v-card>
    
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Folder } from '../../../entities/folder.entity';
import folderService from '../../../services/folder-service';
import router from '../../../router';

@Component({
  name: 'FolderWidget',
  props: [
      '_folder',
    ]
})
export default class FolderWidget extends Vue {

    @Prop({required: true}) public _folder: Folder;

    public get folder(): Folder {
        return this._folder;
    }

    public set folder(folder: Folder) {
        this._folder = folder;
    }

    public changeCurrentFolder() {
        let newLocation = '';
        if (router.currentRoute.query?.location !== undefined) {
            newLocation = `${router.currentRoute.query?.location};${this.folder.name}`
        }
        else {
            newLocation = this.folder.name;
        }
        router.push({
            path: '/documents',
            query: {
                location: newLocation
            }
        });
    }
}
</script>

<style scoped>
    .doc-card-text {
        margin-top: auto;
        white-space:nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }   
</style>
