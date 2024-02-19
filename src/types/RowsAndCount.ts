export abstract class RowsAndCount<T> {
    count: number;
    rows: T[];
    constructor(count: number, rows: T[]) {
        this.count = count;
        this.rows = rows;
    }
}