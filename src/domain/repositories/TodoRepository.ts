import { BaseRepository } from "./BaseRepository";
import { Todo } from "../entities";

export interface TodoRepository extends BaseRepository<Todo> {
    add(todo: Todo): Promise<Todo>;
}