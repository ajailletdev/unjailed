import { AccessRight } from 'src/access-right/access_right.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Document {

  public constructor (doc: Document) {
    if (doc) {
      this.id = doc.id;
      this.originalName = doc.originalName;
      this.mime = doc.mime;
      this.size = doc.size;
      this.createdAt = doc.createdAt;
      this.ownerId = doc.ownerId;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({length: 500})
  originalName: string;

  @Column({length: 500})
  mime: string;

  @Column()
  size: number;

  @ManyToOne(type => User, user => user.ownedDocuments)
  @JoinColumn({ name: "ownerId" })
  owner?: User;

  @Column({ nullable: false })
  ownerId: string;

  @OneToMany(type => AccessRight, (acc) => acc.document)
  viewers?: AccessRight[];
}