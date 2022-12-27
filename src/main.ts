import { Events, Timeout, TimeoutOptions } from "@types";
import { Database } from "midb";
import { TypedEmitter } from "tiny-typed-emitter";
import _ from "lodash";

class Timeouts extends TypedEmitter<Events> {
    public restore: boolean
    public db: Database
    constructor(options?: TimeoutOptions) {
        super()
        this.restore = options?.restore ?? true
        this.db = new Database()
        this.db.start()
    }
    public async update_timeouts(timeouts: Timeout[]): Promise<void> {
        await this.db.set('timeouts', timeouts)
    }
    public async get_timeouts(): Promise<Timeout[]> {
       return (await this.db.get('timeouts')) || []
    }
    public async add(ms: number, id: string, data: any): Promise<void> {
        let list = await this.get_timeouts()
        let t: Timeout = { "id": id, "time": ms, "expires": Date.now() + ms, "data": data }
        list.push(t)
        await this.update_timeouts(list)
        this.emit('create', t)
        this.set_expire(t, t.time)
    }
    public async remove(timeout: Timeout): Promise<void> {
        let list = await this.get_timeouts()
        this.update_timeouts(list.filter(t => !_.isEqual(t, timeout)))
    }
    private async set_expire(timeout: Timeout, time: number): Promise<void> {
        setTimeout(() => { this.out_now(timeout) }, time)
    }
    private async out_now(timeout: Timeout): Promise<void> {
        let list = await this.get_timeouts()
        await this.remove(timeout)
        if(list.find(t => t.id === timeout.id)) this.emit('expires', timeout)
    }
    public async start(): Promise<void> {
        let list = await this.get_timeouts()
        for(const timeout of list) {
            if(Date.now() >= timeout.expires) {
                await this.remove(timeout)
                if(this.restore) this.emit('expires', timeout)
            } else {
                let left = timeout.expires - Date.now()
                this.set_expire(timeout, left)
            }
        }
    }
}

export { Timeouts }
export default { Timeouts }