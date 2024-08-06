import { IRedis } from "../../redis/IRedis";
import { enrichEvent } from "../utils/eventEnrichment";

export class EventCollector {
    constructor(private readonly redis: IRedis) {
    }

    async collectEvent(game: string, event: string) : Promise<number> {
        return await this.redis.rPush("events", enrichEvent(event, [game]));
    }
}
