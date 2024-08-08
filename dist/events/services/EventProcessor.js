"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventProcessor = void 0;
const eventEnrichment_1 = require("../utils/eventEnrichment");
class EventProcessor {
    constructor(redis, bigQuery, eventsNamespace) {
        this.redis = redis;
        this.bigQuery = bigQuery;
        this.eventsNamespace = eventsNamespace;
    }
    async processEvents() {
        const eventString = await this.redis.lPopOne("events");
        if (!eventString) {
            return 0;
        }
        const parsedEvent = (0, eventEnrichment_1.parseEnrichedEvent)(eventString);
        const game = parsedEvent.enrichmentData[0];
        await this.bigQuery.insertRows("events_" + this.eventsNamespace, game, parsedEvent.event);
        return 1;
    }
}
exports.EventProcessor = EventProcessor;
//# sourceMappingURL=EventProcessor.js.map