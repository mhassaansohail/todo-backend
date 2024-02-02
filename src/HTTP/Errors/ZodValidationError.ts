export class ZodValidationError extends Error {
    message: string;
    constructor(error: any) {
        super("");
        this.message = this.getErrorMessages(error);
    }
    getErrorMessages(error: any) {
        return error.errors.map((issue: any) => issue.message).join(', ');
    }
}