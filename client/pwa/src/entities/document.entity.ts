import axios from "axios";

export class Document {

    public constructor (doc: Document) {
      if (doc) {
        this.id = doc.id;
        this.originalName = doc.originalName;
        this.mime = doc.mime;
        this.size = doc.size;
        this.createdAt = doc.createdAt;
      }
    }
  
    id?: string;
    createdAt?: Date;
    originalName!: string;
    mime!: string;
    size!: number;

    apiName = 'document';


    public async getPreview(): Promise<File> {
        const res = await axios.get(`api/${this.apiName}/preview/${this.id}`,{
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
      const res = await axios.patch(`api/${this.apiName}/${this.id}/filename/${name}`);
      this.originalName = res.data.originalName;
    }
}