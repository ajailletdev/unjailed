import { User } from "./user.entity";

export class Folder {
    public constructor (folder: Folder) {
          this.id = folder.id;
          this.parentFolderId = folder.parentFolderId;
          this.userId = folder.userId;
          this.name = folder.name;
      }
    
      id?: string;
    
      name: string;
    
      parentFolder?: Folder;

      parentFolderId?: string;
    
      user?: User;
    
      userId: string;
    
      documents?: Document[];
    
      childFolders?: Folder[];
}