import { inject, injectable } from "tsyringe";
import { TodoDeletedEvent } from "./TodoDeletedEvent";
import { Result } from "@carbonteq/fp";
import { IEventManager } from "../../../../interfaces/IEventManager";
import { NotificationService } from "../../../notifications/NotificationService";

@injectable()
export class TodoDeletedEventListener {
    eventEmitter: IEventManager;
    notificationService: NotificationService;
    constructor(
        @inject("EventManager") eventEmitter: IEventManager,
        @inject("NotificationService") notificationService: NotificationService,
        ) {
        this.eventEmitter = eventEmitter;
        this.notificationService = notificationService;
        this.listen();
    }

    listen() {
        this.eventEmitter.emitter.on('todoDeleted', async (todoDeletedEvent: TodoDeletedEvent): Promise<Result<any, Error>> => {
            try {
                const message = `Todo with id: ${todoDeletedEvent.getDetails().todoId} has been deleted.`
                return Result.Ok((await this.notificationService.sendNotification(message)).unwrap());
            } catch (error: any) {
                return Result.Err(new Error(`Error handling todoDeleted event: ${error.message}`));
            }
        });
    }
}
