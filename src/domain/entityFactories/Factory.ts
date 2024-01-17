export interface Factory<T> {
    createEntity(entity: T | null): T ;
    createEntities(entities: T[]): T[];
}