import { RowsAndCount } from "types";

export interface BaseRepository<T> {
    fetchAll(offset: number, limit: number, queryParams: Partial<T>): Promise<RowsAndCount<T>>;
    fetchById(id: string): Promise<T | null>;
    update(id: string, obj: T): Promise<T>;
    remove(id: string): Promise<T>;
}