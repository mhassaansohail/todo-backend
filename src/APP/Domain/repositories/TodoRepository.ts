import { BaseRepository, NotFoundError, RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import Todo from "../entities/Todo";
import { Result } from "@carbonteq/fp";
import { TodoAttributes } from "../attributes/todo";
import { InvalidOperationOnTodo } from "../exceptions/todo/InvalidOperationOnTodo.exception";

export abstract class TodoRepository extends BaseRepository<Todo> {
    async fetchAll(): Promise<RepositoryResult<Todo[]>> {
        return Result.Err(new InvalidOperationOnTodo());
    }
    abstract fetchById(id: UUIDVo): Promise<RepositoryResult<Todo>>;

    abstract fetchAllPaginated(
        offset: number, limit: number, conditionParams: Partial<TodoAttributes>
        ): Promise<RepositoryResult<Todo[]>>;

    abstract countTotalRows(conditionParams: Partial<TodoAttributes>): Promise<RepositoryResult<number>>;
}