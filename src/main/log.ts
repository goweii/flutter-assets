export class Log {
    static v(message?: any, ...optionalParams: any[]) {
        console.log(`[Flutter Assets] ${message}`, ...optionalParams);
    }

    static d(message?: any, ...optionalParams: any[]) {
        console.debug(`[Flutter Assets] ${message}`, ...optionalParams);
    }

    static i(message?: any, ...optionalParams: any[]) {
        console.info(`[Flutter Assets] ${message}`, ...optionalParams);
    }

    static w(message?: any, ...optionalParams: any[]) {
        console.warn(`[Flutter Assets] ${message}`, ...optionalParams);
    }

    static e(message?: any, ...optionalParams: any[]) {
        console.error(`[Flutter Assets] ${message}`, ...optionalParams);
    }
}