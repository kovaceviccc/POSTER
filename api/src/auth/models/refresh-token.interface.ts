
export interface RefreshToken {
    id?: string;
    refreshToken?: string;
    revoked?: boolean;
    dateCreated?: Date;
    expieryDate?: Date;
    jwtToken?: string;
}