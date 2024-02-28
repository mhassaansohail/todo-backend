import { DtoValidationResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp"

interface IFromAppTodoDto {
  Id: UUIDVo;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IToPresentationTodoDto {
  todoId: string,
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoDto {
  constructor() { };

  public static toPresentation(
    { Id, title, description, completed, createdAt, updatedAt }: IFromAppTodoDto
  ): DtoValidationResult<IToPresentationTodoDto> {
    return Result.Ok({
      todoId: Id.serialize(),
      title,
      description,
      completed,
      createdAt,
      updatedAt
    })
  }
}