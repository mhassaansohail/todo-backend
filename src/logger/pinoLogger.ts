import pino from 'pino';

export const pinoLogger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
        bindings: (bindings: any) => {
            return { pid: bindings.pid, host: bindings.hostname };
        },
        level: (label: string) => {
            return { level: label.toUpperCase() };
        },
    },
    redact: {
        paths: [
            'password',
            'user.password',
            '*.user.password',
        ],
        remove: true,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});