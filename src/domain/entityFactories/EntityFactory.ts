import { Factory } from "./Factory";

export abstract class EntityFactory<T> implements Factory<T>{
    public abstract createEntity(entity: T | null): T;
    public createEntities(entities: T[]): T[] {
        return entities.map(entity => this.createEntity(entity));
    }
    protected abstract createNullEntity(): T;
}