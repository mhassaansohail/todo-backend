export abstract class ModelAndCount<T> {
    count: number;
    models: T[];
    constructor(count: number, models: T[]) {
        this.count = count;
        this.models = models;
    }
}