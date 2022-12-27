import { TypedEmitter } from "tiny-typed-emitter";

export interface Timeout {
    id: string
    time: number
    expires: number
    data: any
}

export interface TimeoutOptions {
    restore: boolean
}

export interface Events {
    'expires': (timeout: Timeout) => void
    'deleted': (timeout: Timeout) => void
    'create': (timeout: Timeout) => void
    'ready': (timeouts: Timeouts) => void
}


class Timeouts extends TypedEmitter<Events> {
    /**
     * If the class should emit expired timeouts after crash
     */
    restore: boolean;
    /**
     * The default database
     */
    db: Database;
    constructor(options?: TimeoutOptions);
    /**
     * 
     * @param {Timeout[]} timeouts The new timeouts array
     */
    update_timeouts(timeouts: Timeout[]): Promise<void>;
    /**
     * Get the timeouts array
     */
    get_timeouts(): Promise<Timeout[]>;
    /**
     * Add a new timeout
     * @param {number} ms The time to wait
     * @param {string} id The timeout custom id
     * @param {any} data Anything to save
     */
    add(ms: number, id: string, data: any): Promise<void>;
    /**
     * Remove and cancel a timeout
     * @param {Timeout} timeout Remove a timeout
     */
    remove(timeout: Timeout): Promise<void>;
    private set_expire;
    private out_now;
    /**
     * Starts the class, this is used to restore the timeouts after crashes
     */
    start(): Promise<void>;
}