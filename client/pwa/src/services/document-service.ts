import { Document } from '../entities/document.entity';
import axios from 'axios';
import authService from './auth-service';
import { User } from '@/entities/user.entity';
import { Subject } from 'rxjs';

class DocumentService {

    private user: User | null = null;

    private documents: Document[] = [];
    public documentsSubject: Subject<Document[]> =  new Subject();

    private currentDocument: Document | null = null;
    public currentDocumentSubject: Subject<Document | null> =  new Subject();

    constructor () {
        authService.userSubject.subscribe(async (res) => {
            this.user = res;
            await this.initAllDocument();
        });
        authService.emitUser();
    }

    public emitDocuments () {
        this.documentsSubject.next(this.documents);
    }

    public setAllDocuments(docs: Document[]) {
        this.documents = docs;
        this.emitDocuments();
    } 

    public async initAllDocument () {
        this.documents = await this.findAllDocuments();
        this.emitDocuments();
    }

    public emitCurrentDocument () {
        this.currentDocumentSubject.next(this.currentDocument);
    }

    public setCurrentDocument (doc: Document | null) {
        this.currentDocument = doc;
        this.emitCurrentDocument();
    }


    public async deleteDocument (id: string): Promise<Document | undefined> {
        try {
            const res = await axios.delete(`${process.env.VUE_APP_BACKEND_URL}/document/${id}`);
            this.setAllDocuments(this.documents.filter((doc) => doc.id !== id));
            return res.data as Document;
        }
        catch (_) {
            console.error(_);
        }
    }

    public async findAllDocuments (): Promise<Document[]> {
        if (this.user?.id) {
            try {
                const res = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/document/${this.user.id}`);
                return res.data.map((doc: Document) => {
                    return new Document(doc);
                });
            }
            catch (_) {
                console.error(_);
            }
        } else return [];
    }


    public async postDocuments (docs: File[]): Promise<Document[] | undefined> {
        if (this.user?.id) {
            try {
                const formData = new FormData();
                docs.map((doc) => {
                    formData.append('file', doc);
                });
    
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/document/upload/${this.user.id}`,
                    formData
                );
                
                const added = (response.data as Document[]).map((doc) => {
                    return new Document(doc);
                });

                this.documents.unshift(...added);
                this.emitDocuments();
                return added;
            }
            catch (_) {
                console.error(_);
            }
        }
    }


    public getCurrentDocument(): Document | null {
        return this.currentDocument;
    }
}

export default new DocumentService();