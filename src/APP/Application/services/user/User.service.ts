import { inject, injectable } from "tsyringe";
import { Result } from "@carbonteq/fp";
import User from "../../../Domain/entities/UserEntity";
import { UserRepository } from "../../../Domain/repositories/UserRepository";
import { PaginatedCollection } from "../../../Domain/pagination/PaginatedCollection";
import { PaginationOptions } from "../../../Domain/pagination/PaginatedOptions";
import { AppResult, UUIDVo } from "@carbonteq/hexapp";
import { CreateUserDto, FetchUserPaginationOptionsDto, UpdateUserDto, UserIdDto } from "../../dto";
import { UserAlreadyExists } from "../../../Infrastructure/adapters/repositories/exceptions/user/UserAlreadyExistsException";
import { UserNotFoundWithParams } from "../../../Infrastructure/adapters/repositories/exceptions/user/UserNotFoundWithParamException";
import { IEncryptionService } from "../../interfaces/IEncryptionService";

@injectable()
export class UserService {
    private repository: UserRepository;
    private encryptionService: IEncryptionService;
    constructor(
        @inject("UserRepository") repository: UserRepository,
        @inject("EncryptionService") encryptionService: IEncryptionService
    ) {
        this.repository = repository;
        this.encryptionService = encryptionService;
    }

    async getUsers({ pageSize, pageNumber, name, userName, email }: FetchUserPaginationOptionsDto): Promise<AppResult<PaginatedCollection<User>>> {
        try {
            const conditionParams = { name, userName, email }
            const totalUserRows = (await this.repository.countTotalRows(conditionParams)).unwrap();
            const paginationOptions: PaginationOptions = new PaginationOptions(pageSize, pageNumber);
            const userRows = (await this.repository.fetchAllPaginated
                (paginationOptions.offset, paginationOptions.limit, conditionParams)).unwrap();
            return AppResult.fromResult(Result.Ok(new PaginatedCollection
                (userRows, totalUserRows, pageNumber, pageSize)));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async getUserById({ userId }: UserIdDto): Promise<AppResult<User>> {
        try {
            const userIdVo = UUIDVo.fromStrNoValidation(userId);
            return AppResult.fromResult(Result.Ok((await this.repository.fetchById(userIdVo)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async createUser({ name, userName, email, password, age }: CreateUserDto): Promise<AppResult<User>> {
        try {
            password = this.encryptionService.encryptPassword(password).unwrap();
            const userEntity = User.create(name, userName, email, password, age);
            if ((await this.repository.existsBy("email", email)).unwrap()) {
                return AppResult.fromResult(Result.Err(new UserAlreadyExists("email", email)));
            }
            if ((await this.repository.existsBy("userName", userName)).unwrap()) {
                return AppResult.fromResult(Result.Err(new UserAlreadyExists("userName", userName)));
            }
            return AppResult.fromResult(Result.Ok((await this.repository.insert(userEntity)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async updateUser({ userId, name, userName, email, password, age }: UpdateUserDto): Promise<AppResult<User>> {
        try {
            password = this.encryptionService.encryptPassword(password).unwrap();
            const toUpdateUser = (await this.repository.fetchById(UUIDVo.fromStrNoValidation(userId))).unwrap();
            if ((await this.repository.existsBy("userName", userName)).unwrap() && toUpdateUser.userName !== userName) {
                    return AppResult.fromResult(Result.Err(new UserAlreadyExists("userName", userName)));
            }
            if (((await this.repository.existsBy("email", email)).unwrap() && toUpdateUser.email !== email)) {
                return AppResult.fromResult(Result.Err(new UserAlreadyExists("email", email)));
            }
            toUpdateUser.update({ name, email, userName, password, age });
            return AppResult.fromResult(Result.Ok((await this.repository.update(toUpdateUser)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async deleteUser({ userId }: UserIdDto): Promise<AppResult<User>> {
        try {
            const userIdVo = UUIDVo.fromStrNoValidation(userId);
            if (!(await this.repository.existsBy("Id", userId)).unwrap()) {
                return AppResult.fromResult(Result.Err(new UserNotFoundWithParams("userId", userId)));
            }
            return AppResult.fromResult(Result.Ok((await this.repository.deleteById(userIdVo)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }
}
