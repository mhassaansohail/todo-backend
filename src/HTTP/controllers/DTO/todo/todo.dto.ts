import Todo from "../../../../APP/Domain/entities/Todo";

interface ITodoDTO {
  Id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoDTO {
  constructor() { };

  public static toPresentation(todo: Todo): ITodoDTO {
    return todo.serialize();
  }
}