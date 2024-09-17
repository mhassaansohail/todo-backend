import { expect } from 'chai';
import Todo from '../../../../src/APP/Domain/entities/Todo';
import { UUIDVo } from '@carbonteq/hexapp';

describe('Todo Entity', () => {
    it('should create a new todo', () => {
        const title = 'Test Todo';
        const description = 'Test Description';
        const completed = false;

        const todo = Todo.create(title, description, completed);

        expect(todo).to.be.instanceOf(Todo);
        expect(todo.title).to.equal(title);
        expect(todo.description).to.equal(description);
        expect(todo.completed).to.equal(completed);
        expect(todo.Id).to.be.instanceOf(UUIDVo);
        expect(todo.createdAt).to.be.instanceOf(Date);
        expect(todo.updatedAt).to.be.instanceOf(Date);
    });

    it('should update todo properties', () => {
        const title = 'Test Todo';
        const description = 'Test Description';
        const completed = false;

        const todo = Todo.create(title, description, completed);

        const newTitle = 'Updated Todo';
        const newDescription = 'Updated Description';
        const newCompleted = true;

        todo.update({ title: newTitle, description: newDescription, completed: newCompleted });
        const todoSerialized = todo.serialize();
        
        expect(todoSerialized.title).to.equal(newTitle);
        expect(todoSerialized.description).to.equal(newDescription);
        expect(todoSerialized.completed).to.equal(newCompleted);
    });
});
