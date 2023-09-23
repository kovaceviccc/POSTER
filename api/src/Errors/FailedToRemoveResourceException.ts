import { HttpException, HttpStatus, ServiceUnavailableException } from "@nestjs/common";

export class FailedToRemoveResourceException extends HttpException {

    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);

    }
}