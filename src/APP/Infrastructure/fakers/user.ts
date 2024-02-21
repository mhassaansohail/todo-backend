import { faker } from '@faker-js/faker';
import { UserAttributes } from '../../Domain/attributes/user';
import bcrypt from 'bcrypt';

function generateHashedPassword(password: string): string {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

function getRandomBirthDate(): string {
    const startDate = '1980-01-01T00:00:00.000Z';
    const endDate = '2020-01-01T00:00:00.000Z';
    const randomBirthDate = faker.date.between(startDate, endDate);

    return randomBirthDate.toISOString();
}

function getAge(): number {
    const birthDate = new Date(getRandomBirthDate());
    const age = Math.floor((new Date().valueOf() - birthDate.valueOf()) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
}

interface IUser {
    userId: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
}

export function createRandomUser(): IUser {
    const plainPassword = faker.internet.password();
    const hashedPassword = generateHashedPassword(plainPassword);
    return {
        userId: faker.string.uuid(),
        name: faker.person.fullName(),
        userName: faker.person.firstName(),
        email: faker.internet.email(),
        age: getAge(),
        password: hashedPassword,
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime()
    };
}
