export interface EventWithEnrichmentData {
  enrichmentData: string[];
  event: any;
}

export function enrichEvent(eventObj: object, enrichmentData: string[]) {
  return [...enrichmentData, JSON.stringify(eventObj)].join("|");
}

export function parseEnrichedEvent(
  enrichedEvent: string
): EventWithEnrichmentData {
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
