"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnrichedEvent = exports.enrichEvent = void 0;
function enrichEvent(eventObj, enrichmentData) {
    return [...enrichmentData, JSON.stringify(eventObj)].join("|");
}
exports.enrichEvent = enrichEvent;
function parseEnrichedEvent(enrichedEvent) {
    const jsonEventStart = enrichedEvent.indexOf("{");
    const enrichmentString = enrichedEvent.substring(0, jsonEventStart - 1);
    const eventString = enrichedEvent.substring(jsonEventStart);
    const eventObject = JSON.parse(eventString);
    if (eventObject.eventData) {
        eventObject.eventData = JSON.stringify(eventObject.eventData); // https://cloud.google.com/bigquery/docs/reference/standard-sql/json-data#use_the_legacy_streaming_api
    }
    return {
        enrichmentData: enrichmentString === "" ? [] : enrichmentString.split("|"),
        event: eventObject,
    };
}
exports.parseEnrichedEvent = parseEnrichedEvent;
//# sourceMappingURL=eventEnrichment.js.map