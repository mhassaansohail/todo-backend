import axios, { AxiosInstance } from "axios";
import { Result } from "@carbonteq/fp";
import { IRequestService } from "../../../Application/ports/IRequestService";

export class RequestService implements IRequestService {
    requestClient: AxiosInstance
    constructor() {
        this.requestClient = axios;
    }
    async makePostRequest(url: string, payload: any): Promise<Result<any, Error>> {
        try {
            return Result.Ok(await this.requestClient.post(url, payload));
        } catch (error: any) {
            return Result.Err(new Error(error.message))
        }
    }
}