import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from 'src/document/document.entity';
import { AccessRight } from "src/access-right/access_right.entity";
import { Folder } from "src/folder/folder.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ unique: true })
    login: string;
    
    @Column()
    password: string;

    @OneToMany(type => Document, (doc) => doc.owner)
    ownedDocuments?: Document[];

    @OneToMany(type => AccessRight, (acc) => acc.user)
    sharedWithMe?: AccessRight[];

    @OneToMany(type => Folder, (folder) => folder.user)
    ownedFolder?: Folder[];
}