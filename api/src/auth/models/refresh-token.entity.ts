import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RefreshToken } from "./refresh-token.interface";


@Entity()
export class RefreshTokenEntity implements RefreshToken {


    @PrimaryGeneratedColumn()
    id: string;
    @Column()
    refreshToken: string;
    @Column()
    revoked: boolean;
    @Column()
    jwtToken: string;
    @Column()
    dateCreated: Date;
    @Column()
    expieryDate: Date;

    @BeforeInsert()
    intializeEntity() {
        this.revoked = false;
        this.dateCreated = new Date()
        this.expieryDate = new Date();
        this.expieryDate.setMonth(this.expieryDate.getMonth() + 1);
    }
}