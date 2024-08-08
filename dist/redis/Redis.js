"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
const redis_1 = require("redis");
class Redis {
    constructor(url) {
        this.client = (0, redis_1.createClient)({ url });
        this.client.on("error", (error) => {
            const theError = error.origin
                ? error.origin.toString()
                : error.toString();
            console.log(`Redis: Error - ${theError}`);
            console.log(`Redis: Signaling self-termination`);
            process.kill(process.pid, "SIGTERM");
        });
        this.client.on("warning", (warning) => {
            console.log(`Redis: Warning - ` + warning);
        });
        this.client.on("ready", () => {
            //this.ready = true;
            console.log(`Redis: Connected`);
        });
        this.client.on("end", () => {
            //this.ready = false;
            console.log(`Redis: Disconnected`);
        });
    }
    static async CreateAndConnect(url) {
        const redis = new Redis(url);
        await redis.connect();
        return redis;
    }
    async connect() {
        return await this.client.connect();
    }
    async rPush(key, element) {
        return await this.client.rPush(key, element);
    }
    async lPopOne(key) {
        return await this.client.lPop(key);
    }
    async lRange(key, start, stop) {
        return await this.client.lRange(key, start, stop);
    }
    async memoryStats() {
        //What is the type returned from memory stats?
        return (await this.client.memoryStats());
    }
}
exports.Redis = Redis;
//# sourceMappingURL=Redis.js.map