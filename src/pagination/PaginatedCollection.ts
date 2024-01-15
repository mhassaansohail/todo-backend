export class PaginatedCollection<T> {
    records: T[];
    totalRecords: number;
    recordsInPage: number;
    pageNumber: number;
    totalPages: number;
    prevPage: number | undefined;
    nextPage: number | undefined;

    constructor(records: T[], totalRecords: number, pageSize: number, pageNumber: number) {
        this.records = records;
        this.recordsInPage = this.recordsInCurrentPage;
        this.totalRecords = totalRecords;
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
        return Math.ceil(this.totalRecords / this.recordsInPage);
    }

    get recordsInCurrentPage(): number {
        return this.records.length;
    }
}
