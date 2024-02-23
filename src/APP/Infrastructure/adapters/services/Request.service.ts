import axios, { AxiosInstance } from "axios";
import { Result } from "@carbonteq/fp";
import { IRequestService } from "../../../Application/ports/IRequestService";
import { RequestServiceFailure } from "./exceptions/RequestService.exception";

export class RequestService implements IRequestService {
    requestClient: AxiosInstance
    constructor() {
        this.requestClient = axios;
    }
    async makePostRequest(url: string, payload: any): Promise<Result<any, Error>> {
        try {
            return Result.Ok(await this.requestClient.post(url, payload));
        } catch (error: any) {
            return Result.Err(new RequestServiceFailure("makePostRequest"));
        }
    }
}