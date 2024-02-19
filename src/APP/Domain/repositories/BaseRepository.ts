export interface BaseRepository<T> {
    count(queryParams: Partial<T>): Promise<number>;
    fetchAll(offset: number, limit: number, queryParams: Partial<T>): Promise<T[]>;
    fetchById(id: string): Promise<T>;
    update(id: string, obj: T): Promise<T>;
    remove(id: string): Promise<T>;
}