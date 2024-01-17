export class Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;

    constructor(id: string = "NULL", title: string = "NULL", description: string = "NULL", completed: boolean = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }
}