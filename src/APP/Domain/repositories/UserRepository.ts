import { BaseRepository, RepositoryResult } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import { InvalidOperationOnUser } from "../exceptions/user/InvalidOperationOnUserException";
import User, { UserAttributesSerialized } from "../entities/UserEntity";

export abstract class UserRepository extends BaseRepository<User> {

    async fetchAll(): Promise<RepositoryResult<User[]>> {
        return Result.Err(new InvalidOperationOnUser());
    }

    abstract fetchAllPaginated(
        offset: number, limit: number, conditionParams: Partial<UserAttributesSerialized>)
        : Promise<RepositoryResult<User[]>>;

    abstract existsBy(prop: keyof UserAttributesSerialized, value: UserAttributesSerialized[keyof UserAttributesSerialized]): Promise<RepositoryResult<boolean>>

    abstract fetchByUserNameOrEmail(userName?: string, email?: string): Promise<RepositoryResult<User>>;

    abstract countTotalRows(conditionParams: Partial<UserAttributesSerialized>): Promise<RepositoryResult<number>>;
}