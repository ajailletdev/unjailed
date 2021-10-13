import { User } from "src/user/user.entity";
import { Document } from 'src/document/document.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Folder {

  public constructor (folder: Folder) {
    if (folder) {
      this.id = folder.id;
      this.name = folder.name;
      this.parentFolderId = folder.parentFolderId;
      this.userId = folder.userId;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(type => Folder, folder => folder.childFolders)
  @JoinColumn({ name: "parentFolderId" })
  parentFolder?: Folder;

  @Column()
  parentFolderId?: string;

  @ManyToOne(type => User, user => user.sharedWithMe)
  @JoinColumn({ name: "userId" })
  user?: User;

  @Column({ nullable: false })
  userId: string;

  @OneToMany(type => Document, (doc) => doc.folder)
  documents?: Document[];

  @OneToMany(type => Folder, (folder) => folder.parentFolder)
  childFolders?: Folder[];
}