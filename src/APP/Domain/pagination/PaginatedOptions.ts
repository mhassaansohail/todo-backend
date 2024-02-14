import { PaginationOptionsException } from "../exceptions/pagination";

export class PaginationOptions {
    private pageSize: number;
    private pageNumber: number;

    constructor (pageSize: number, pageNumber: number) {
        if (!this.validateParams(pageSize, pageNumber)) {
            throw new PaginationOptionsException("Pagination Options Error: Page number and pageSize options should be greater than 1.")
        }
        this.pageSize = pageSize
        this.pageNumber = pageNumber
    }

    get offset() {
        return this.pageSize * (this.pageNumber - 1);
    }

    get limit() {
        return this.pageSize;
    }

    private validateParams(pageSize: number, pageNumber: number) {
        if (pageSize <= 0 || isNaN(pageSize)) {
            return false;
        }
        if (pageNumber <= 0 || isNaN(pageNumber)) {
            return false;
        }
        return true;
    }
}