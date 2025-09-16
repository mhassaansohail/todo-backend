import "reflect-metadata";
import { Result } from '@carbonteq/fp';
import { AppErrStatus } from "@carbonteq/hexapp";
import { expect } from 'chai';
import sinon from 'sinon';
import { v4 } from "uuid";
import { TodoService } from '../../../../src/APP/Application/services/todo/TodoService';
import { TodoRepository } from '../../../../src/APP/Domain/repositories/TodoRepository';
import { IEventManager } from '../../../../src/APP/Application/interfaces/IEventManager';
import { PaginatedCollection } from '../../../../src/APP/Domain/pagination/PaginatedCollection';
import Todo from '../../../../src/APP/Domain/entities/TodoEntity';
import { AddTodoDto, UpdateTodoDto } from "../../../../src/APP/Application/dto";
import { DbMalfunction } from "../../../../src/APP/Infrastructure/adapters/repositories/exceptions/db/DbMalfunctionException";
import { TodoNotFound } from "../../../../src/APP/Domain/exceptions/todo/TodoNotFoundException";
import { TodoAlreadyExists } from "../../../../src/APP/Infrastructure/adapters/repositories/exceptions/todo/TodoAlreadyExistsException";

describe('TodoService', () => {
    let todoService: TodoService;
    let todoRepositoryMock: TodoRepository;
    let eventEmitterMock: IEventManager;

    beforeEach(() => {
        todoRepositoryMock = {} as TodoRepository;
        eventEmitterMock = {} as IEventManager;
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
        const errorStatus = AppErrStatus.ExternalServiceFailure;;
        todoRepositoryMock.countTotalRows = sinon.stub().rejects(new DbMalfunction(""));

        const result = await todoService.getTodos({ pageNumber, pageSize, title: "", description: "" });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().status).to.equal(errorStatus);
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
        const errorStatus = AppErrStatus.NotFound;
        todoRepositoryMock.fetchById = sinon.stub().rejects(new TodoNotFound(''));

        const result = await todoService.getTodoById({ todoId });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().status).to.equal(errorStatus);
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
        const errorStatus = AppErrStatus.AlreadyExists;
        const errorMessage = 'Error adding todo';
        todoRepositoryMock.insert = sinon.stub().rejects(new TodoAlreadyExists(errorMessage));

        const result = await todoService.addTodo(createTodoDto);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().status).to.equal(errorStatus);
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
        const errorStatus = AppErrStatus.ExternalServiceFailure;
        todoRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(Todo.create('Old Todo', 'Old description', false)));
        todoRepositoryMock.update = sinon.stub().rejects(new DbMalfunction(''));

        const result = await todoService.updateTodo(updateTodoDto);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().status).to.equal(errorStatus);
    });

    it('should delete a todo by ID', async () => {
        const todoId = v4();
        const fakeTodo = Todo.create('Test Todo', 'Test description', false);
        todoRepositoryMock.existsById = sinon.stub().resolves(Result.Ok(true));
        todoRepositoryMock.deleteById = sinon.stub().resolves(Result.Ok(fakeTodo));
        eventEmitterMock.emit = sinon.stub().resolves(true);

        const result = await todoService.deleteTodo({ todoId });

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should handle error when deleting a todo by ID', async () => {
        const todoId = v4();
        const errorStatus = AppErrStatus.NotFound;
        const errorMessage = 'Error deleting todo';
        // todoRepositoryMock.deleteById = sinon.stub().rejects(new Error(errorMessage));
        todoRepositoryMock.existsById = sinon.stub().rejects(new TodoNotFound(errorMessage));

        const result = await todoService.deleteTodo({ todoId });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().status).to.equal(errorStatus);
    });
});
