import { expect } from 'chai';
import sinon from 'sinon';
import { PrismaUserRepository } from '../../../../../../src/APP/Infrastructure/adapters/repositories/PrismaRepositories/User.repository';
import User from '../../../../../../src/APP/Domain/entities/User.entity';
import { UserNotFound } from '../../../../../../src/APP/Domain/exceptions/user/UserNotFound.exception';
import { UUIDVo } from '@carbonteq/hexapp';
import { v4 } from 'uuid';
import { DbMalfunction } from '../../../../../../src/APP/Infrastructure/adapters/repositories/exceptions/shared/DbMalfunction.exception';
import { PrismaClient } from '@prisma/client';

describe('UserRepository', () => {
    // let prismaStub: Prisma;
    let prismaStub: PrismaClient;
    prismaStub = new PrismaClient();
    let loggerSpy: { error: sinon.SinonSpy; info: sinon.SinonSpy; };
    let prismaUserRepository: PrismaUserRepository;

    beforeEach(() => {
        // prismaStub = {} as Prisma;
        // prismaStub.user = {
        //     findUnique: () => {
        //         return null;
        //     },
        //     findMany: () => {
        //         return null;
        //     },
        //     create: () => {
        //         return null;
        //     },
        //     count: () => {
        //         return null;
        //     },
        //     update: () => {
        //         return null;
        //     },
        //     delete: () => {
        //         return null;
        //     }
        // }
        loggerSpy = {
            error: sinon.spy(),
            info: sinon.spy(),
        };
        // prismaUserRepository = new PrismaUserRepository(prismaStub, loggerSpy as any);
        prismaUserRepository = new PrismaUserRepository(prismaStub, loggerSpy as any);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should fetch a user by ID', async () => {
        const fakeUser = User.create("TestingFetchById", "testFetch", "testFetch@gmail.com", "qwerqtwqerqwerqwer", 10);
        const userId = fakeUser.Id;
        prismaStub.user.findUnique = sinon.stub().resolves(fakeUser.serialize());

        const result = await prismaUserRepository.fetchById(userId);
        
        expect(result.isOk()).to.be.true;
        const fetchedUserEntity = result.unwrap();
        expect(fetchedUserEntity.Id.serialize()).to.equal(fakeUser.Id.serialize());
        expect(fetchedUserEntity.name).to.equal(fakeUser.name);
        expect(fetchedUserEntity.userName).to.equal(fakeUser.userName);
        expect(fetchedUserEntity.age).to.equal(fakeUser.age);
    });

    it('should handle not found user by ID', async () => {
        const userId = v4();
        prismaStub.user.findUnique = sinon.stub().resolves(null);

        const result = await prismaUserRepository.fetchById(UUIDVo.fromStrNoValidation(userId));

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr() instanceof UserNotFound);
    });

    it('should insert a new user', async () => {
        const fakeUser = User.create("TestingInsert", "testInsert", "testInsert@gmail.com", "qwerqtwqerqwerqwer", 10);
        prismaStub.user.create = sinon.stub().resolves(fakeUser.serialize());

        const result = await prismaUserRepository.insert(fakeUser);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should update an existing user', async () => {
        const fakeUser = User.create("TestingUpdate", "testUpdate", "testUpdate@gmail.com", "qwerqtwqerqwerqwer", 10);
        prismaStub.user.update = sinon.stub().resolves(fakeUser.serialize());

        const result = await prismaUserRepository.update(fakeUser);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should delete a user by ID', async () => {
        const fakeUser = User.create("TestingDelete", "testDelete", "testDelete@gmail.com", "qwerqtwqerqwerqwer", 10);
        const userId = fakeUser.Id;
        prismaStub.user.delete = sinon.stub().resolves(fakeUser.serialize());

        const result = await prismaUserRepository.deleteById(userId);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUser);
    });

    it('should handle not found user when deleting by ID', async () => {
        const userId = v4();
        prismaStub.user.delete = sinon.stub().resolves(null);

        const result = await prismaUserRepository.deleteById(UUIDVo.fromStrNoValidation(userId));

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr() instanceof UserNotFound);
    });

    it('should count total rows', async () => {
        const conditionParams = { name: 'test', email: '' };
        const totalCount = 5;
        prismaStub.user.count = sinon.stub().resolves(totalCount);

        const result = await prismaUserRepository.countTotalRows(conditionParams);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(totalCount);
    });

    it('should handle error when counting total rows', async () => {
        const queryParams = { name: 'test', email: '' };
        const errorMessage = 'Error counting total rows';
        prismaStub.user.count = sinon.stub().rejects(new Error(errorMessage));

        const result = await prismaUserRepository.countTotalRows(queryParams);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr()).to.be.instanceOf(DbMalfunction);
    });

    it('should fetch all paginated users', async () => {
        const queryParams = { name: 'TestingFetchPaginated', email: '' };
        const offset = 0;
        const limit = 3;
        const fakeUsers = [
            User.create("TestingFetchPaginated", "testFetch1", "testFetch1@gmail.com", "qwerqtwqerqwerqwer", 10),
            User.create("TestingFetchPaginated", "testFetch2", "testFetch2@gmail.com", "qwerqtwqerqwerqwer", 10),
            User.create("TestingFetchPaginated", "testFetch3", "testFetch3@gmail.com", "qwerqtwqerqwerqwer", 10),
        ];
        prismaStub.user.findMany = sinon.stub().resolves(fakeUsers.map(user => user.serialize()));

        const result = await prismaUserRepository.fetchAllPaginated(offset, limit, queryParams);

        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.deep.equal(fakeUsers);
    });

    it('should handle error when fetching all paginated users', async () => {
        const queryParams = { name: 'test', email: '' };
        const offset = 0;
        const limit = 10;
        const errorMessage = 'Error fetching all paginated users';
        prismaStub.user.findMany = sinon.stub().rejects(new Error(errorMessage));

        const result = await prismaUserRepository.fetchAllPaginated(offset, limit, queryParams);

        expect(result.isErr()).to.be.true;
        expect(result.unwrapErr()).to.be.instanceOf(DbMalfunction);
    });
});
