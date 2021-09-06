import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from 'src/document/document.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    login: string;
    
    @Column()
    password: string;

    @OneToMany(type => Document, (doc) => doc.owner)
    ownedDocuments?: Document[];
}