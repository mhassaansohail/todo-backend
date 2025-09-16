import { InsufficientPaginatedRowsException } from "../exceptions/pagination/InsufficientPaginatedRowsException";

export class PaginatedCollection<T> {
    rows: T[];
    totalRows: number;
    rowsInPage: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;

    constructor(rows: T[], totalRows: number, pageNumber: number, pageSize: number) {
        this.rows = rows;
        this.rowsInPage = this.rowsInCurrentPage;
        this.pageSize = pageSize;
        this.totalRows = totalRows;
        this.pageNumber = pageNumber;
        this.totalPages = this.calculateTotalPages();
        this.hasPrevPage = this.prevPageExists();
        this.hasNextPage = this.nextPageExists();
    }

    private prevPageExists(): boolean {
        return this.pageNumber > 1 ? true : false;
    }

    private nextPageExists(): boolean {
        return this.pageNumber < this.totalPages ? true : false;
    }

    private calculateTotalPages(): number {
        if (this.rowsInPage < 1) {
            throw new InsufficientPaginatedRowsException("End of Page.");
        }
        return Math.ceil(this.totalRows / this.pageSize);
    }

    get rowsInCurrentPage(): number {
        return this.rows.length;
    }
}