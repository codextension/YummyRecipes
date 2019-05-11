export class InternalError implements Error {
    name: string;
    message: string;
    type: ErrorType;

    constructor(message: string, type: ErrorType) {
        this.message = message;
        this.type = type;
    }

}

export enum ErrorType {
    EMPTY_AUTH = 1,
    CONN_ERROR,
    QUERY_ERROR,
    IMG_UPLOAD_ERROR
}