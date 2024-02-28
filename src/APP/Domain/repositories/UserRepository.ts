import { BaseRepository, RepositoryResult } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import { InvalidOperationOnUser } from "../exceptions/user/InvalidOperationOnUserException";
import User, { IUserAttributes } from "../entities/UserEntity";

export abstract class UserRepository extends BaseRepository<User> {

    async fetchAll(): Promise<RepositoryResult<User[]>> {
        return Result.Err(new InvalidOperationOnUser());
    }

    abstract fetchAllPaginated(
        offset: number, limit: number, conditionParams: Partial<IUserAttributes>)
        : Promise<RepositoryResult<User[]>>;

    abstract existsBy(prop: keyof IUserAttributes, value: IUserAttributes[keyof IUserAttributes]): Promise<RepositoryResult<boolean>>

    abstract fetchByUserNameOrEmail(userName?: string, email?: string): Promise<RepositoryResult<User>>;

    abstract countTotalRows(conditionParams: Partial<IUserAttributes>): Promise<RepositoryResult<number>>;
}