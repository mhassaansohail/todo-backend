import { expect } from 'chai';
import User from './User';
import { InvalidAgeException } from '../exceptions/user/InvalidAge.exception';
import { UUIDVo } from '@carbonteq/hexapp';

describe('User Entity', () => {
    it('should create a new user', () => {
        const name = 'Test User';
        const email = 'test@example.com';
        const userName = 'testUser';
        const password = 'password1234';
        const age = 25;

        const user = new User(name, userName, email, password, age);

        expect(user).to.be.instanceOf(User);
        expect(user.name).to.equal(name);
        expect(user.email).to.equal(email);
        expect(user.userName).to.equal(userName);
        expect(user.password).to.equal(password);
        expect(user.age).to.equal(age);
        expect(user.Id).to.be.instanceOf(UUIDVo);
        expect(user.createdAt).to.be.instanceOf(Date);
        expect(user.updatedAt).to.be.instanceOf(Date);
    });

    it('should throw an error if age is less than 1', () => {
        const name = 'Test User';
        const email = 'test@example.com';
        const userName = 'testUser';
        const password = 'password1234';
        const age = 0;

        expect(() => new User(name, userName, email, password, age)).to.throw(InvalidAgeException);
    });

    it('should update user properties', () => {
        const name = 'Test User';
        const email = 'test@example.com';
        const userName = 'testUser';
        const password = 'password1234';
        const age = 25;

        const user = new User(name, userName, email, password, age);

        const newName = 'Test User New';
        const newEmail = 'test_new@example.com';

        user.update({ name: newName, email: newEmail });

        expect(user.name).to.equal(newName);
        expect(user.email).to.equal(newEmail);
        expect(user.userName).to.equal(userName);
        expect(user.password).to.equal(password);
        expect(user.age).to.equal(age);
    });
});
