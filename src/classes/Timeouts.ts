import { TimeoutOptions, Events, Timeout } from "@types";
import { TypedEmitter } from "tiny-typed-emitter";
import { Database } from "midb";
import _ from "lodash"

class Timeouts extends TypedEmitter<Events> {
    public db: Database
    public restore: boolean
    constructor(options?: TimeoutOptions) {
        super()
        this.db = new Database()
        this.restore = !!options?.restore
        setTimeout(this.fetch, 1_000)
    }
    public async update_items(items: Timeout[]) {
        this.db.set('timeouts', items)
    }
    public async get_items(): Promise<Timeout[]> {
        return await this.db.get('timeouts') || [] as Timeout[]
    }
    public async add(miliseconds: number, id: string, data: unknown): Promise<void> {
        let t = await this.get_items()
        let e = Date.now() + miliseconds
        let timeout = { time: miliseconds, id, data, expires: e, cancelled: false }
        t.push(timeout)
        this.update_items(t)
        this.call_expire(timeout, miliseconds)
        this.emit('create', { time: miliseconds, id, data, expires: e, cancelled: false })
    }
    public async remove(query: Timeout | string) {
        let items = await this.get_items()
        if(typeof query == 'string') {
            if(items.find(t => t.id == query)) {
                this.update_items(_.without(items, items.find(t => t.id == query)!))
            }
        } else {
            this.update_items(_.without(items, query))
        }
    }
    public async call_expire(timeout: Timeout, time: number) {
        setTimeout(async() => {
            this.out(timeout)
        }, time)
    }
    public async fetch() {
        let t = await this.get_items()
        for(const item of t) {
            if(item.expires >= Date.now()) {
                if(this.restore) await this.out(item)
                else await this.remove(item)
            } else {
                let left = Date.now() - item.expires
                await this.call_expire(item, left)
            }
        }
    }
    private async out(timeout: Timeout) {
        let list = await this.get_items()
        await this.update_items(_.without(list, timeout))
        if(list.includes(timeout)) this.emit('expires', timeout)
    }
}

export { Timeouts }