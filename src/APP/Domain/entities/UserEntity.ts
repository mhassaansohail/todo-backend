import { BaseEntity } from "@carbonteq/hexapp";
import { IEntity } from "@carbonteq/hexapp";
import { InvalidAgeException } from "../exceptions/user/InvalidAgeException";

export type UserAttributesSerialized = {
    Id: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;
};

export type UserAttributes = IEntity & Omit<UserAttributesSerialized, "Id">;

type IUser = UserAttributesSerialized & Omit<IEntity, 'Id'>;

class User extends BaseEntity implements UserAttributes {
    private _name: string;
    private _email: string;
    private _userName: string;
    private _password: string;
    private _age: number;

    constructor(name: string, userName: string, email: string, password: string, age: number) {
        super();
        this.enforceMinAgeLimit(age);
        this._name = name;
        this._userName = userName;
        this._password = password;
        this._email = email;
        this._age = age;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get userName(): string {
        return this._userName;
    }

    get password(): string {
        return this._password;
    }

    get age(): number {
        return this._age;
    }

    static create(name: string, userName: string, email: string, password: string, age: number): User {
        return new User(name, userName, email, password, age);
    }

    static from(userObj: UserAttributes): User {
        const { name, userName, email, password, age } = userObj;
        const userEntity = new User(name, userName, email, password, age);
        userEntity._copyBaseProps(userObj);
        return userEntity;
    }

    static fromObj(userObj: IUser): User {
        const { name, userName, email, password, age } = userObj;
        const userEntity = new User(name, userName, email, password, age);
        userEntity._fromSerialized(userObj);
        return userEntity;
    }

    serialize(): any {
        return {
            ...super._serialize(),
            name: this.name,
            userName: this.userName,
            email: this.email,
            password: this.password,
            age: this.age
        }
    }

    update({name, email, userName, password, age}: Partial<IUser>) {
        if (name) {
            this._name = name;
        }
        if (email) {
            this._email = email;
        }
        if (userName) {
            this._userName = userName;
        }
        if (password) {
            this._password = password;
        }
        if (age) {
            this.enforceMinAgeLimit(age);
            this._age = age;
        }
        this.markUpdated();
    }

    enforceMinAgeLimit(age: number): void {
        if (age < 1) {
            throw new InvalidAgeException("age", age.toString());
        }
    }
}

export default User;