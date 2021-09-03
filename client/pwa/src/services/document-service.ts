import { Document } from '../entities/document.entity';
import axios from 'axios';


class DocumentService {


    private currentDocument: Document | null = null;

    public async deleteDocument (id: string): Promise<Document | undefined> {
        try {
            const res = await axios.delete(`${process.env.VUE_APP_BACKEND_URL}/document/${id}`);
            return res.data as Document;
        }
        catch (_) {
            console.error(_);
        }
    }

    public async findAllDocuments (): Promise<Document[] | undefined> {
        try {
            const res = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/document`);
            return res.data.map((doc: Document) => {
                return new Document(doc);
            });
        }
        catch (_) {
            console.error(_);
        }
    }


    public async postDocuments (docs: File[]): Promise<Document[] | undefined> {
        try {
            const formData = new FormData();
            docs.map((doc) => {
                formData.append('file', doc);
            });

            const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/document/upload`,
                formData
            );

            return response.data as Document[];
        }
        catch (_) {
            console.error(_);
        }
    }

    public setCurrentDocument(doc: Document | null): void {
        this.currentDocument = doc;
    }

    public getCurrentDocument(): Document | null {
        return this.currentDocument;
    }
}

export default new DocumentService();