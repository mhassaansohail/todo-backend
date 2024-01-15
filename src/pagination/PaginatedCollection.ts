export class PaginatedCollection<T> {
    records: T[];
    totalRecords: number;
    pageSize: number;
    recordsInPage: number;
    pageNumber: number;
    totalPages: number;
    prevPage: number | undefined;
    nextPage: number | undefined;

    constructor(records: T[], totalRecords: number, pageSize: number, pageNumber: number, prevPage?: number, nextPage?: number) {
        this.records = records;
        this.totalRecords = totalRecords;
        this.pageSize = pageSize;
        this.recordsInPage = this.recordsInCurrentPage;
        this.pageNumber = pageNumber;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
        this.totalPages = this.calculateTotalPages();
    }

    private calculateTotalPages(): number {
        return Math.ceil(this.totalRecords / this.recordsInPage);
    }

    get recordsInCurrentPage(): number {
        return this.records.length;
    }

    get endIndexOfPage(): number {
        return this.pageNumber * this.pageSize;
    }

    get startIndexOfPage(): number {
        return this.endIndexOfPage - this.recordsInCurrentPage + 1;
    }

    hasPrevPage(): boolean {
        return this.prevPage !== undefined;
    }

    hasNextPage(): boolean {
        return this.nextPage !== undefined;
    }
}
