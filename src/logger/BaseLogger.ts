export interface BaseLogger {
    info(message: string): void;
    error(message: string): void;
}