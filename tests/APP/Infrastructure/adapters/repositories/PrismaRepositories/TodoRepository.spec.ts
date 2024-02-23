import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { PrismaTodoRepository } from '../../../../../../src/APP/Infrastructure/adapters/repositories/PrismaRepositories/Todo.repository';
import Todo from '../../../../../../src/APP/Domain/entities/Todo.entity';
import { TodoNotFound } from '../../../../../../src/APP/Domain/exceptions/todo/TodoNotFound.exception';
import { UUIDVo } from '@carbonteq/hexapp';
import { v4 } from 'uuid';
import { DbMalfunction } from '../../../../../../src/APP/Infrastructure/adapters/repositories/exceptions/shared/DbMalfunction.exception';
import { PrismaClient } from '@prisma/client';

describe('TodoRepository', () => {
    // let prismaStub: sinon.SinonStubbedInstance<PrismaClient>;
    // let prismaStub: Prisma;
    let prismaStub: PrismaClient;
    prismaStub = new PrismaClient();
    let loggerSpy: { error: sinon.SinonSpy; info: sinon.SinonSpy; };
    let prismaTodoRepository: PrismaTodoRepository;

    beforeEach(() => {
        // prismaStub = sinon.createStubInstance(PrismaClient);
        // prismaStub = {} as Prisma;
        // prismaStub.todo = {
        //     findUnique: () => {
        //         return Promise.resolve({ id: 1, title: 'Test Todo', description: 'A test todo item', completed: false });
        //     },
        //     findMany: () => {
        //         return Promise.resolve([{ id: 1, title: 'Test Todo', description: 'A test todo item', completed: false }]);
        //     },
        //     create: () => {
        //         return Promise.resolve({ id: 1, title: 'New Todo', description: 'A new todo item', completed: false });
        //     },
        //     count: () => {
        //         return Promise.resolve(1);
        //     },
        //     update: () => {
        //         return Promise.resolve({ id: 1, title: 'Updated Todo', description: 'An updated todo item', completed: true });
        //     },
        //     delete: () => {
        //         return Promise.resolve({ id: 1 });
        //     }
        // }
        loggerSpy = {
            error: sinon.spy(),
            info: sinon.spy(),
        };
        // prismaTodoRepository = new PrismaTodoRepository(prismaStub, loggerSpy as any);
        prismaTodoRepository = new PrismaTodoRepository(prismaStub, loggerSpy as any);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should fetch a todo by ID', async () => {
        const fakeTodo = Todo.create("TestingFetchByIdTodo", "Testing FetchByIdTodo", false);
        const todoId = fakeTodo.Id;
        const fetchedTodo = {
            todoId: todoId.serialize(),
            title: fakeTodo.title,
            description: fakeTodo.description,
            completed: fakeTodo.completed,
            createdAt: fakeTodo.createdAt,
            updatedAt: fakeTodo.updatedAt
        }
        prismaStub.todo.findUnique = sinon.stub().resolves(fetchedTodo);

        const result = await prismaTodoRepository.fetchById(todoId);

        expect(result.isOk()).to.be.true;
        const fetchedTodoEntity = result.unwrap();
        expect(fetchedTodoEntity.Id.serialize()).to.equal(fakeTodo.Id.serialize());
        expect(fetchedTodoEntity.title).to.equal(fakeTodo.title);
        expect(fetchedTodoEntity.description).to.equal(fakeTodo.description);
        expect(fetchedTodoEntity.completed).to.equal(fakeTodo.completed);
    });

    it('should handle not found todo by ID', async () => {
        const todoId = v4();

        prismaStub.todo.findUnique = sinon.stub().resolves(null);
        

        const result = await prismaTodoRepository.fetchById(UUIDVo.fromStrNoValidation(todoId));

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr() instanceof TodoNotFound);
    });

    it('should insert a new todo', async () => {
        const fakeTodo = Todo.create("TestingInsertTodo", "Testing InsertTodo", false);

        prismaStub.todo.create = sinon.stub().resolves(fakeTodo.serialize());

        const result = await prismaTodoRepository.insert(fakeTodo);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should update an existing todo', async () => {
        const fakeTodo = Todo.create("TestingUpdateTodo", "Testing UpdateTodo", false);

        prismaStub.todo.update = sinon.stub().resolves(fakeTodo.serialize());

        const result = await prismaTodoRepository.update(fakeTodo);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should delete a todo by ID', async () => {
        const fakeTodo = Todo.create("TestingDeleteTodo", "Testing DeleteTodo", false);
        const todoId = fakeTodo.Id;

        prismaStub.todo.delete = sinon.stub().resolves(fakeTodo.serialize());

        const result = await prismaTodoRepository.deleteById(todoId);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodo);
    });

    it('should handle not found todo when deleting by ID', async () => {
        const todoId = v4();

        prismaStub.todo.delete = sinon.stub().resolves(null);
        loggerSpy.error = sinon.spy();

        const result = await prismaTodoRepository.deleteById(UUIDVo.fromStrNoValidation(todoId));

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr()).to.be.instanceOf(DbMalfunction);
    });

    it('should count total rows', async () => {
        const conditionParams = { title: 'test', description: '' };
        const totalCount = 5;

        prismaStub.todo.count = sinon.stub().resolves(totalCount)

        const result = await prismaTodoRepository.countTotalRows(conditionParams);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.equal(totalCount);
    });

    it('should fetch all paginated todos', async () => {
        const conditionParams = { title: 'test', description: '' };
        const offset = 0;
        const limit = 3;
        const fakeTodos = [
            Todo.create("TestingFetchTodo", "Testing FetchTodo1", false),
            Todo.create("TestingFetchTodo", "Testing FetchTodo2", false),
            Todo.create("TestingFetchTodo", "Testing FetchTodo3", false),
        ];

        prismaStub.todo.findMany = sinon.stub().resolves(fakeTodos.map(todo => todo.serialize()))


        const result = await prismaTodoRepository.fetchAllPaginated(offset, limit, conditionParams);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeTodos);
    });

    it('should handle error when fetching all paginated todos', async () => {
        const conditionParams = { title: 'test', description: '' };
        const offset = 0;
        const limit = 10;
        const errorMessage = 'Error fetching all paginated todos';

        prismaStub.todo.findMany = sinon.stub().resolves(new Error(errorMessage));
        loggerSpy.error = sinon.spy();

        const result = await prismaTodoRepository.fetchAllPaginated(offset, limit, conditionParams);

        sinon.assert.calledOnce(loggerSpy.error);
        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr()).to.be.instanceOf(DbMalfunction);
    });
});
