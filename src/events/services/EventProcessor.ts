import { IBigQuery } from "../../bigquery/IBigQuery";
import { IRedis } from "../../redis/IRedis";
import { parseEnrichedEvent } from "../utils/eventEnrichment";

export class EventProcessor {
    constructor(private readonly redis: IRedis, private readonly bigQuery: IBigQuery, private readonly eventsNamespace: string) {
    }

    async processEvents() : Promise<number> {
        const eventString = await this.redis.lPopOne("events");

        if(!eventString) {
            return 0;
        }

        const parsedEvent = parseEnrichedEvent(eventString);
        const game = parsedEvent.enrichmentData[0];
        await this.bigQuery.insertRows("events_" + this.eventsNamespace, game, parsedEvent.event);

        return 1;
    }
}
