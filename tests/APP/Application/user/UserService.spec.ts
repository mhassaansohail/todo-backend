import { expect } from 'chai';
import { UserService } from '../../../../src/APP/Application/user/UserService';
import { UserRepository } from '../../../../src/APP/Domain/repositories/UserRepository';
import { IEncryptionService } from '../../../../src/APP/Application/ports/IEncryptionService';
import User from '../../../../src/APP/Domain/entities/User';
import { Result } from '@carbonteq/fp';
import { PaginatedCollection } from '../../../../src/APP/Domain/pagination/PaginatedCollection';
import sinon from 'sinon';
import { v4 } from 'uuid';
import { CreateUserDto, UpdateUserDto } from 'src/APP/Application/DTO';

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: UserRepository;
    let encryptionServiceMock: IEncryptionService;

    beforeEach(() => {
        userRepositoryMock = {} as UserRepository;
        encryptionServiceMock = {} as IEncryptionService;
        userService = new UserService(userRepositoryMock, encryptionServiceMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get users paginated', async () => {
        const pageSize = 10;
        const pageNumber = 1;
        const fakeUsers = [User.create('Test Paginated User', 'testPaginatedUser', 'testUser@example.com', 'password', 25)];
        userRepositoryMock.countTotalRows = sinon.stub().resolves(Result.Ok(1));
        userRepositoryMock.fetchAllPaginated = sinon.stub().resolves(Result.Ok(fakeUsers));

        const result = await userService.getUsers({ pageSize, pageNumber, name: 'John' });

        expect(result.isOk()).to.be.true;
        const paginatedCollection = result.unwrap();
        expect(paginatedCollection).to.be.instanceOf(PaginatedCollection);
        expect(paginatedCollection.rows).to.deep.equal(fakeUsers);
        expect(paginatedCollection.rowsInCurrentPage).to.equal(1);
        expect(paginatedCollection.pageNumber).to.equal(pageNumber);
        expect(paginatedCollection.pageSize).to.equal(pageSize);
    });

    it('should handle error when getting users paginated', async () => {
        const pageSize = 10;
        const pageNumber = 1;
        const errorMessage = 'Error fetching users';
        userRepositoryMock.countTotalRows = sinon.stub().rejects(new Error(errorMessage));

        const result = await userService.getUsers({ pageSize, pageNumber, name: 'John' });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should get user by ID', async () => {
        const userId = '123';
        const fakeUser = User.create('Test Fetch User', 'testFetchByIdUser', 'testUser@example.com', 'password', 25);
        userRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(fakeUser));

        const result = await userService.getUserById({ userId });

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should handle error when getting user by ID', async () => {
        const userId = v4();
        const errorMessage = 'Error fetching user';
        userRepositoryMock.fetchById = sinon.stub().rejects(new Error(errorMessage));

        const result = await userService.getUserById({ userId });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should create a user', async () => {
        const createUserDto: CreateUserDto = {
            name: 'Test Create User',
            userName: 'testCreateUser',
            email: 'testUser@example.com',
            password: 'password12345',
            age: 25
        };
        const hashedPassword = 'password12345';
        encryptionServiceMock.encryptPassword = sinon.stub().returns(Result.Ok(hashedPassword));
        const fakeUser = User.create(createUserDto.name, createUserDto.userName, createUserDto.email, hashedPassword, createUserDto.age);
        userRepositoryMock.insert = sinon.stub().resolves(Result.Ok(fakeUser));

        const result = await userService.createUser(createUserDto);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should handle error when creating a user', async () => {
        const createUserDto: CreateUserDto = {
            name: 'Test Create User',
            userName: 'testCreateUser',
            email: 'testUser@example.com',
            password: 'password12345',
            age: 25
        };
        const errorMessage = 'Error creating user';
        encryptionServiceMock.encryptPassword = sinon.stub().returns(Result.Ok("password12345"));
        userRepositoryMock.insert = sinon.stub().rejects(new Error(errorMessage));

        const result = await userService.createUser(createUserDto);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should update a user', async () => {
        const updateUserDto: UpdateUserDto = {
            userId: v4(),
            name: 'Test Update User',
            userName: 'testUpdateUser',
            email: 'testUser@example.com',
            password: 'password12345',
            age: 25
        };
        const hashedPassword = 'password12345';
        encryptionServiceMock.encryptPassword = sinon.stub().returns(Result.Ok(hashedPassword));
        const fakeUser = User.create(updateUserDto.name, updateUserDto.userName, updateUserDto.email, hashedPassword, updateUserDto.age);
        userRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(fakeUser));
        userRepositoryMock.update = sinon.stub().resolves(Result.Ok(fakeUser));

        const result = await userService.updateUser(updateUserDto);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should handle error when updating a user', async () => {
        const updateUserDto: UpdateUserDto = {
            userId: v4(),
            name: 'Test Update User',
            userName: 'testUpdateUser',
            email: 'testUser@example.com',
            password: 'password12345',
            age: 25
        };
        const errorMessage = 'Error updating user';
        encryptionServiceMock.encryptPassword = sinon.stub().returns(Result.Ok("password12345"));
        userRepositoryMock.fetchById = sinon.stub().resolves(Result.Ok(User.create('Test Update User', 'testUpdateUser', 'testUser@example.com', 'password12345', 25)));
        userRepositoryMock.update = sinon.stub().rejects(new Error(errorMessage));

        const result = await userService.updateUser(updateUserDto);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });

    it('should delete a user by ID', async () => {
        const userId = v4();
        const fakeUser = User.create('Test Delete User', 'testDeleteUser', 'testUser@example.com', 'password12345', 25);
        userRepositoryMock.deleteById = sinon.stub().resolves(Result.Ok(fakeUser));

        const result = await userService.deleteUser({ userId });

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should handle error when deleting a user by ID', async () => {
        const userId = v4();
        const errorMessage = 'Error deleting user';
        userRepositoryMock.deleteById = sinon.stub().rejects(new Error(errorMessage));

        const result = await userService.deleteUser({ userId });

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr().message).to.equal(errorMessage);
    });
});
