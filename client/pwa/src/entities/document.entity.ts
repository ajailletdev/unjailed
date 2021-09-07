import axios from "axios";
import { AccessRight } from "./access_right.entity";
import { User } from "./user.entity";

export class Document {

    public constructor (doc: Document) {
      if (doc) {
        this.id = doc.id;
        this.originalName = doc.originalName;
        this.mime = doc.mime;
        this.size = doc.size;
        this.createdAt = doc.createdAt;
        this.owner = doc.owner;
        this.ownerId = doc.ownerId;
        this.viewers = doc.viewers;
      }
    }
  
    id?: string;
    createdAt?: Date;
    originalName!: string;
    mime!: string;
    size!: number;
    owner?: User;
    ownerId: string;
    viewers: AccessRight[];

    apiName = 'document';


    public async getPreview(): Promise<File> {
        const res = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/${this.apiName}/preview/${this.id}`,{
          responseType: 'blob'
        });
        const file = new File([ res.data ], this.originalName, { type: this.mime });
        return file;
    }

    public async getPreviewUrl(): Promise<string> {
        const file = await this.getPreview();
        return window.URL.createObjectURL(file);
    }

    public async changeFilename(name: string): Promise<void> {
      const res = await axios.patch(`${process.env.VUE_APP_BACKEND_URL}/${this.apiName}/${this.id}/filename/${name}`);
      this.originalName = res.data.originalName;
    }

    public async addViewer(user: User): Promise<void> {
      const res = await axios.patch(`${process.env.VUE_APP_BACKEND_URL}/${this.apiName}/${this.id}/addViewer/${user.id}`);
      this.viewers = [...res.data.viewers];
    }

    public async removeViewer(user: User): Promise<void> {
      const res = await axios.patch(`${process.env.VUE_APP_BACKEND_URL}/${this.apiName}/${this.id}/removeViewer/${user.id}`);
      this.viewers = [...res.data.viewers];
    }
}