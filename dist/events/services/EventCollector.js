"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCollector = void 0;
const eventEnrichment_1 = require("../utils/eventEnrichment");
class EventCollector {
    constructor(redis) {
        this.redis = redis;
    }
    async collectEvent(game, event) {
        return await this.redis.rPush("events", (0, eventEnrichment_1.enrichEvent)(event, [game]));
    }
}
exports.EventCollector = EventCollector;
//# sourceMappingURL=EventCollector.js.map