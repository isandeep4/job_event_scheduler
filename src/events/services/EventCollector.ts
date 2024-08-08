import { IRedis } from "../../redis/IRedis";
import { enrichEvent } from "../utils/eventEnrichment";

export class EventCollector {
  constructor(private readonly redis: IRedis) {}

  async collectEvent(game: string, event: object): Promise<number> {
    return await this.redis.rPush("events", enrichEvent(event, [game]));
  }
}
