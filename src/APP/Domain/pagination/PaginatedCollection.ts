import { InsufficientPaginatedRowsException } from "../exceptions/pagination/InsufficientPaginatedRowsException";

export class PaginatedCollection<T> {
    rows: T[];
    totalRows: number;
    rowsInPage: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    prevPage: number | undefined;
    nextPage: number | undefined;

    constructor(rows: T[], totalRows: number, pageNumber: number, pageSize: number) {
        this.rows = rows;
        this.rowsInPage = this.rowsInCurrentPage;
        this.pageSize = pageSize;
        this.totalRows = totalRows;
        this.pageNumber = pageNumber;
        this.totalPages = this.calculateTotalPages();
        this.prevPage = this.calculatePrevPage();
        this.nextPage = this.calculateNextPage();
    }

    private calculatePrevPage(): number | undefined {
        return this.pageNumber > 1 ? this.pageNumber - 1 : undefined;
    }

    private calculateNextPage(): number | undefined {
        return this.pageNumber < this.totalPages ? this.pageNumber + 1 : undefined;
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