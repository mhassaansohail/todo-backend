import { inject, injectable } from "tsyringe";
import { NotificationService } from "../notifications/Notification.service";
import { EventEmitter } from "./EventEmitter";
import { UserRepository } from "../../Domain/repositories/User.repository";
import { TodoDeletedEvent } from "./TodoDeletedEvent";
import { Result } from "@carbonteq/fp";

@injectable()
export class TodoDeletedEventListener {
    eventEmitter: EventEmitter;
    notificationService: NotificationService;
    userRepository: UserRepository;
    constructor(
        @inject("EventEmitter") eventEmitter: EventEmitter,
        @inject("NotificationService") notificationService: NotificationService,
        @inject("UserRepository") userRepository: UserRepository) {
        this.eventEmitter = eventEmitter;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.startListening();
    }

    startListening() {
        this.eventEmitter.emitter.on('todoDeleted', async (todoDeletedEvent: TodoDeletedEvent): Promise<Result<any, Error>> => {
            try {
                const message = `Todo with id: ${todoDeletedEvent.getDetails().todoId} has been deleted.`
                const users = (await this.userRepository.fetchAll()).unwrap();
                return Result.Ok((await this.notificationService.sendNotifications(users, message)).unwrap());
            } catch (error: any) {
                return Result.Err(new Error(`Error handling todoDeleted event: ${error.message}`));
            }
        });
    }
}
