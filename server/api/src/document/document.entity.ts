import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
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
}