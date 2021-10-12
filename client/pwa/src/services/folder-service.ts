import { Folder } from "@/entities/folder.entity";
import axios from "axios";
import { Subject } from "rxjs";

const API_PATH = process.env.VUE_APP_BACKEND_URL;

class FolderService {

    private _folders: Folder[] = [];
    public foldersSubject: Subject<Folder[]> = new Subject();

    private _currentFolder: Folder | null = null;
    public currentfolderSubject: Subject<Folder | null> = new Subject();

    public emitFolders(): void {
        this.foldersSubject.next(this._folders);
    }

    public async setFoldersFromCurrent(): Promise<void> {
        if (this._currentFolder) {
            this._folders = (await axios.get(`${API_PATH}/folder/parent_folder/${this._currentFolder.id}`))
            .data
            .map((folder: Folder) => new Folder(folder));
            this.emitFolders();
        }
    }

    public emitCurrentFolder(): void {
        this.currentfolderSubject.next(this._currentFolder);
    }

    public setCurrentFolder(folder: Folder | null): void {
        this._currentFolder = folder;
        this.emitCurrentFolder();
    }

    public getCurrentfolder(): Folder | null {
        return this._currentFolder;
    }

    public async initializeCurrentFolder(): Promise<void> {
        try {
            const folder = new Folder((await axios.get(`${API_PATH}/folder/initial_folder`)).data);
            this.setCurrentFolder(folder);
        }
        catch (_) {
            console.error(_);
        }
    }

    public async createFolder(name: string) {
        if (!this._currentFolder) console.error("No current folder");
        else {
            try {
                const newFolder = new Folder((await axios.post(`${API_PATH}/folder`, {
                    name,
                    currentFolder: this._currentFolder.name
                })).data);
                this._folders.push(newFolder);
                this.emitFolders();
            }
            catch (_) {
                console.error(_);
            }
        }
    }

    public async setCurrentFromLocation(location: string): Promise<void> {
        try {
            this._currentFolder = new Folder((await axios.get(`${API_PATH}/folder/from_location/${location}`)).data);
            this.emitCurrentFolder();
        }
        catch (_) {
            console.error(_);
        }
    }
}

export default new FolderService();