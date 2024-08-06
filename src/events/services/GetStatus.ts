import { IRedis } from "../../redis/IRedis";

export class GetStatus {
    constructor(private readonly redis: IRedis) {
    }

    async get() {
        console.log("GetStatus");

        const events = await this.redis.lRange("events", 0, -1);
        const basicStats = await this.redis.memoryStats();

        return JSON.stringify({redis: basicStats, events: { length: events.length, entries: events } }, null, 4);
    }
}
