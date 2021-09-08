import { User } from "src/user/user.entity";
import { Document } from 'src/document/document.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccessRight {

  public constructor (acc: AccessRight) {
    if (acc) {
      this.id = acc.id;
      this.document = acc.document;
      this.documentId = acc.documentId;
      this.user = acc.user;
      this.userId = acc.userId;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(type => Document, doc => doc.viewers)
  @JoinColumn({ name: "documentId" })
  document?: Document;

  @Column({ nullable: false })
  documentId: string;

  @ManyToOne(type => User, user => user.sharedWithMe)
  @JoinColumn({ name: "userId" })
  user?: User;

  @Column({ nullable: false })
  userId: string;
}