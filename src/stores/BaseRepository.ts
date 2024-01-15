import { ModelAndCount } from "types";

export interface BaseRepository<T> {
    count(): Promise<number>;
    fetch(offset: number, limit: number, queryParams: Partial<T>): Promise<ModelAndCount<T>>;
    fetchById(id: string): Promise<T | null>;
    create(obj: T): Promise<T>;
    update(id: string, obj: T): Promise<T>;
    remove(id: string): Promise<T>;
}