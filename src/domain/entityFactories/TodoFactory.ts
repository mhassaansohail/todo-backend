import { Todo, NullTodo } from "../entities";
import { EntityFactory } from "./EntityFactory";
import { v4 as uuid } from "uuid"

export class TodoFactory extends EntityFactory<Todo> {
    createEntity(todo: Todo | null): Todo {
        if (!todo) {
            return this.createNullEntity();
        }
        return new Todo(todo.id || uuid(), todo.title, todo.description, todo.completed);
    }
    protected createNullEntity(): Todo {
        return new NullTodo();
    }
}