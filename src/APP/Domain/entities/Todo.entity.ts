import { BaseEntity, DateTime } from "@carbonteq/hexapp";
import { TodoAttributes } from "../attributes/Todo.attributes";

interface ITodo {
    Id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

interface IUpdateTodo {
    title: string;
    description: string;
    completed: boolean;
}



export class Todo extends BaseEntity implements TodoAttributes {
    private _title: string;
    private _description: string;
    private _completed: boolean;

    protected constructor(title: string, description: string, completed: boolean) {
        super();
        this._title = title;
        this._description = description;
        this._completed = completed;
    }

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get completed(): boolean {
        return this._completed;
    }
    

    static create(title: string, description: string, completed: boolean): Todo {
        return new Todo(title, description, completed);
    }

    static from(todoObj: TodoAttributes): Todo {
        const { title, description, completed } = todoObj;
        const todoEntity = new Todo(title, description, completed);
        todoEntity._copyBaseProps(todoObj);
        return todoEntity;
    }

    static fromObj(todoObj: ITodo): Todo {
        const { title, description, completed } = todoObj;
        const todoEntity = new Todo(title, description, completed);
        todoEntity._fromSerialized(todoObj);
        return todoEntity;
    }

    serialize() {
        return {
            ...super._serialize(),
            title: this.title,
            description: this.description,
            completed: this.completed
        };
    }

    update({ title, description, completed }: IUpdateTodo) {
        this._title = title;
        this._description = description;
        this._completed = completed;
        this.markUpdated();
    }
}

export default Todo;