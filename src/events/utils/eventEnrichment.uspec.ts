import { enrichEvent, parseEnrichedEvent } from "./eventEnrichment";

describe("enrichEvent", () => {
  describe("with a valid event and no enrichment data items", () => {
    it("should produce a string with the even JSON stringified", async () => {
      //Arrange

      //Act
      const enrichedEvent = enrichEvent({ eventName: "someEvent" }, []);

      //Assert
      expect(enrichedEvent).toEqual('{"eventName":"someEvent"}');
    });
  });

  describe("with a valid event and 2 enrichment data items", () => {
    it("should produce a string with the even JSON stringified and with the enrichment data prefixed and concatenated with a pipe character", async () => {
      //Arrange

      //Act
      const enrichedEvent = enrichEvent({ eventName: "someEvent" }, [
        "lilysgarden",
        "someOtherEnrichmentData",
      ]);

      //Assert
      expect(enrichedEvent).toEqual(
        'lilysgarden|someOtherEnrichmentData|{"eventName":"someEvent"}'
      );
    });
  });
});

describe("parseEnrichedEvent", () => {
  describe("with a valid non-enriched event", () => {
    const eventString = '{"eventName":"someEvent"}';

    it("should produce an event JSON object", async () => {
      //Arrange

      //Act
      const eventWithEnrichmentData = parseEnrichedEvent(eventString);

      //Assert
      expect(eventWithEnrichmentData.event.eventName).toEqual("someEvent");
    });

    it("should produce no enriched data", async () => {
      //Arrange

      //Act
      const eventWithEnrichmentData = parseEnrichedEvent(eventString);

      //Assert
      expect(eventWithEnrichmentData.enrichmentData.length).toEqual(0);
    });
  });

  describe("with a valid enriched event", () => {
    const enrichedEventString =
      'lilysgarden|someOtherEnrichmentData|{"eventName":"someEvent"}';

    it("should produce an event JSON object", async () => {
      //Arrange

      //Act
      const eventWithEnrichmentData = parseEnrichedEvent(enrichedEventString);

      //Assert
      expect(eventWithEnrichmentData.event.eventName).toEqual("someEvent");
    });

    it("should produce enriched data array", async () => {
      //Arrange

      //Act
      const eventWithEnrichmentData = parseEnrichedEvent(enrichedEventString);

      //Assert
      expect(eventWithEnrichmentData.enrichmentData).toEqual([
        "lilysgarden",
        "someOtherEnrichmentData",
      ]);
    });
  });

  describe("with invalid enriched event", () => {
    it("should fail to parse an invalid event", async () => {
      const invalidEventString = "invalid string without json";
      expect(() => parseEnrichedEvent(invalidEventString)).toThrow();
    });
    it("should fail to parse an invalid event", async () => {
      const invalidJSONString = "enrichmentData| {invalid json}";
      expect(() => parseEnrichedEvent(invalidJSONString)).toThrow();
    });
  });
});
