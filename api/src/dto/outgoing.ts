
export type OperationResponse = {
    success: boolean,
    message: string
};

export type InsertionResponse = {

}

export type RefreshTokenRequest = {
    jwtToken: string;
    refreshToken: string;
}