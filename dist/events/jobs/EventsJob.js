"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsJob = void 0;
class EventsJob {
    constructor(eventProcessor) {
        this.eventProcessor = eventProcessor;
    }
    async run() {
        const eventsProcessed = await this.eventProcessor.processEvents();
        if (eventsProcessed > 0) {
            console.log("EventsJob processed " + eventsProcessed + " event(s)");
        }
        return eventsProcessed > 0;
    }
}
exports.EventsJob = EventsJob;
//# sourceMappingURL=EventsJob.js.map