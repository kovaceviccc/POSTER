import { User } from "src/user/user/models/user.interface";

export interface BlogEntry {

    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    updated?: Date;
    likes?: number;
    headerImage?: string;
    publishedDate?: Date;
    isPublished?: boolean;
    author?: User;
}