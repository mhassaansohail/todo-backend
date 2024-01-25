import { BaseRepository } from "./BaseRepository";
import Todo from "../entities/Todo";

export interface TodoRepository extends BaseRepository<Todo> {
    add(todo: Todo): Promise<Todo>;
}