import { UserEntity } from "src/user/user/models/user.entity";
import { User } from "src/user/user/models/user.interface";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogEntry } from "./blog-entry.interface";

@Entity('blog_entry')
export class BlogEntryEntity implements BlogEntry {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    body: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updated: Date;

    @BeforeUpdate()
    updateTimeStamp() {
        this.updated = new Date;
    }

    @Column({ default: 0 })
    likes: number;

    @Column()
    headerImage: string;

    @Column({ nullable: true })
    publishedDate: Date;

    @Column({ default: false })
    isPublished: boolean;
}