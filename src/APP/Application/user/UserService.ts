import { inject, injectable } from "tsyringe";
import { Result } from "@carbonteq/fp";
import User from "../../Domain/entities/User";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { PaginationOptions } from "../../Domain/pagination/PaginatedOptions";
import { IEncryptionService } from "../ports/IEncryptionService";
import { UUIDVo } from "@carbonteq/hexapp";
import { IFetchPaginatedUsers } from "./DTO/IFetchPaginatedUsers.dto";
import { IFetchUserById } from "./DTO/IFetchUserById.dto";
import { IFetchUserByUsername } from "./DTO/IFetchUserByUsername.dto";
import { ICreateUser } from "./DTO/ICreateUser.dto";
import { IUpdateUser } from "./DTO/IUpdateUser.dto";
import { IDeleteUserById } from "./DTO/IDeleteUserById.dto";

@injectable()
export class UserService {
    private repository: UserRepository;
    private encryptionService: IEncryptionService;
    constructor(
        @inject("UserRepository") repository: UserRepository, @inject("EncryptionService") encryptionService: IEncryptionService
    ) {
        this.repository = repository;
        this.encryptionService = encryptionService;
    }

    async getUsers({ pageSize, pageNumber, conditionParams }: IFetchPaginatedUsers): Promise<Result<PaginatedCollection<User>, Error>> {
        try {
            const totalUserRows = (await this.repository.countTotalRows(conditionParams)).unwrap();
            const paginationOptions: PaginationOptions = new PaginationOptions(pageSize, pageNumber);
            const userRows = (await this.repository.fetchAllPaginated(paginationOptions.offset, paginationOptions.limit, conditionParams)).unwrap();
            return Result.Ok(new PaginatedCollection(userRows, totalUserRows, pageNumber, pageSize));
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async getUserById({ userId }: IFetchUserById): Promise<Result<User, Error>> {
        try {
            const userIdVo = UUIDVo.fromStrNoValidation(userId);
            return Result.Ok((await this.repository.fetchById(userIdVo)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async getUserByUsername({ userName }: IFetchUserByUsername): Promise<Result<User, Error>> {
        try {
            return Result.Ok((await this.repository.fetchByUserNameOrEmail(userName)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async createUser(user: ICreateUser): Promise<Result<User, Error>> {
        try {
            const password = user.password;
            const hashedPassword = this.encryptionService.encryptPassword(password).unwrap();
            user.password = hashedPassword;
            const userEntity = User.create(user.name, user.userName, user.email, user.password, user.age);
            return Result.Ok((await this.repository.insert(userEntity)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async updateUser(user: IUpdateUser): Promise<Result<User, Error>> {
        try {
            const password = user.password;
            const hashedPassword = this.encryptionService.encryptPassword(password).unwrap();
            user.password = hashedPassword;
            const toUpdateUser = (await this.repository.fetchById(UUIDVo.fromStrNoValidation(user.userId))).unwrap();
            toUpdateUser.update(user);
            return Result.Ok((await this.repository.update(toUpdateUser)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async deleteUser({ userId }: IDeleteUserById): Promise<Result<User, Error>> {
        try {
            const userIdVo = UUIDVo.fromStrNoValidation(userId);
            return Result.Ok((await this.repository.deleteById(userIdVo)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }
}
