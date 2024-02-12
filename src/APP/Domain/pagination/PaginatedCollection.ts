export class PaginatedCollection<T> {
    rows: T[];
    totalRows: number;
    rowsInPage: number;
    pageNumber: number;
    totalPages: number;
    prevPage: number | undefined;
    nextPage: number | undefined;

    constructor(rows: T[], totalRows: number, offset: number, limit: number) {
        this.rows = rows;
        this.rowsInPage = this.rowsInCurrentPage;
        this.totalRows = totalRows;
        this.pageNumber = this.calculatePageNumber(offset, limit);
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
        if (this.rowsInPage <= 0) {
            throw new Error("End of Page.");
        }
        return Math.ceil(this.totalRows / this.rowsInPage);
    }

    get rowsInCurrentPage(): number {
        return this.rows.length;
    }
    private calculatePageNumber(offset: number, limit: number): number {
        return Math.floor(offset / limit) + 1
    }
}


//Pagination option page,  per page