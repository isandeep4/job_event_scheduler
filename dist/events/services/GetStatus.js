"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatus = void 0;
class GetStatus {
    constructor(redis) {
        this.redis = redis;
    }
    async get() {
        console.log("GetStatus");
        const events = await this.redis.lRange("events", 0, -1);
        const basicStats = await this.redis.memoryStats();
        return JSON.stringify({ redis: basicStats, events: { length: events.length, entries: events } }, null, 4);
    }
}
exports.GetStatus = GetStatus;
//# sourceMappingURL=GetStatus.js.map