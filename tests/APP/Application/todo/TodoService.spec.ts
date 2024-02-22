import "reflect-metadata";
import { expect } from 'chai';
import { TodoService } from '../../../../src/APP/Application/todo/TodoService';
import { TodoRepository } from '../../../../src/APP/Domain/repositories/TodoRepository';
import { IEventEmitter } from '../../../../src/APP/Application/events/IEventEmitter';
import { Result } from '@carbonteq/fp';
import { PaginatedCollection } from '../../../../src/APP/Domain/pagination/PaginatedCollection';
import sinon from 'sinon';
import Todo from '../../../../src/APP/Domain/entities/Todo';
import { v4 } from "uuid";
import { AddTodoDto, UpdateTodoDto } from "../../../../src/APP/Application/DTO";

describe('TodoService', () => {
    let todoService: TodoService;
    let todoRepositoryMock: TodoRepository;
    let eventEmitterMock: IEventEmitter;

    beforeEach(() => {
        todoRepositoryMock = {} as TodoRepository;
        eventEmitterMock = {} as IEventEmitter;
        todoService = new TodoService(todoRepositoryMock, eventEmitterMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get todos paginated', async () => {
        const pageNumber = 1;
        const pageSize = 10;
        const fakeTodos = [Todo.create('Test Todo', 'Test description', false)];
        todoRepositoryMock.countTotalRows = sinon.stub().resolves(Result.Ok(1));
        todoRepositoryMock.fetchAllPaginated = sinon.stub().resolves(Result.Ok(fakeTodos));
        // sinon.stub(todoRepositoryMock, "countTotalRows").resolves(Result.Ok(1));
        // sinon.stub(todoRepositoryMock, 'fetchAllPaginated').resolves(Result.Ok(fakeTodos));

        const result = await todoService.getTodos({ pageNumber, pageSize, title: "", description: "" });

        expect(result.isOk()).to.be.true;
        const paginatedCollection = result.unwrap();
        expect(paginatedCollection).to.be.instanceOf(PaginatedCollection);
        expect(paginatedCollection.rows).to.deep.equal(fakeTodos);
        expect(paginatedCollection.rowsInCurrentPage).to.equal(1);
        expect(paginatedCollection.pageNumber).to.equal(pageNumber);
        expect(paginatedCollection.pageSize).to.equal(pageSize);
    });

    it('should handle error when getting todos paginated', async () => {
        const pageNumber = 1;
        const pageSize = 10;
        const conditionParams = { completed: false };
        const errorMessage = 'Error fetching todos';
        todoRepositoryMock.countTotalRows = sinon.stub().rejects(new Error(errorMessage));

        const result = await todoService.getTodos({ pageNumber, pageSize, title: "", description: "" });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should get todo by ID', async () => {
        const todoId = v4();
        const fakeTodo = Todo.create('Test Todo', 'Test description', false);
        todoRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(fakeTodo));

        const result = await todoService.getTodoById({ todoId });

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should handle error when getting todo by ID', async () => {
        const todoId = v4();
        const errorMessage = 'Error fetching todo';
        todoRepositoryMock.fetchById = sinon.stub().rejects(new Error(errorMessage));

        const result = await todoService.getTodoById({ todoId });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should add a todo', async () => {
        const createTodoDto: AddTodoDto = {
            title: 'New Todo',
            description: 'New description',
            completed: false
        };
        const fakeTodo = Todo.create(createTodoDto.title, createTodoDto.description, createTodoDto.completed);
        todoRepositoryMock.insert = sinon.stub().resolves(Result.Ok(fakeTodo));

        const result = await todoService.addTodo(createTodoDto);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should handle error when adding a todo', async () => {
        const createTodoDto: AddTodoDto = {
            title: 'New Todo',
            description: 'New description',
            completed: false
        };
        const errorMessage = 'Error adding todo';
        todoRepositoryMock.insert = sinon.stub().rejects(new Error(errorMessage));

        const result = await todoService.addTodo(createTodoDto);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should update a todo', async () => {
        const updateTodoDto: UpdateTodoDto = {
            todoId: '123',
            title: 'Updated Todo',
            description: 'Updated description',
            completed: true
        };
        const fakeTodo = Todo.create(updateTodoDto.title, updateTodoDto.description, updateTodoDto.completed);
        todoRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(fakeTodo));
        todoRepositoryMock.update = sinon.stub().resolves(Result.Ok(fakeTodo));

        const result = await todoService.updateTodo(updateTodoDto);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should handle error when updating a todo', async () => {
        const updateTodoDto: UpdateTodoDto = {
            todoId: '123',
            title: 'Updated Todo',
            description: 'Updated description',
            completed: true
        };
        const errorMessage = 'Error updating todo';
        todoRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(Todo.create('Old Todo', 'Old description', false)));
        todoRepositoryMock.update = sinon.stub().rejects(new Error(errorMessage));

        const result = await todoService.updateTodo(updateTodoDto);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should delete a todo by ID', async () => {
        const todoId = v4();
        const fakeTodo = Todo.create('Test Todo', 'Test description', false);
        todoRepositoryMock.deleteById = sinon.stub().resolves(Result.Ok(fakeTodo));
        eventEmitterMock.emit = sinon.stub().resolves(true);

        const result = await todoService.deleteTodo({ todoId });

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should handle error when deleting a todo by ID', async () => {
        const todoId = v4();
        const errorMessage = 'Error deleting todo';
        todoRepositoryMock.deleteById = sinon.stub().rejects(new Error(errorMessage));

        const result = await todoService.deleteTodo({ todoId });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });
});
