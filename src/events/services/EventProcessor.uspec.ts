import { mock } from "jest-mock-extended";
import { IBigQuery } from "../../bigquery/IBigQuery";
import { IRedis } from "../../redis/IRedis";
import { enrichEvent } from "../utils/eventEnrichment";
import { EventProcessor } from "./EventProcessor";

describe("EventProcessor", () => {
  const eventsNamespace = "test";

  describe("with no events in Redis", () => {
    it("should process 0 events", async () => {
      //Arrange
      const redis = mock<IRedis>();
      const bigQuery = mock<IBigQuery>();

      //Act
      const eventProcessor = new EventProcessor(
        redis,
        bigQuery,
        eventsNamespace
      );
      const processedEvents = await eventProcessor.processEvents();

      //Assert
      expect(processedEvents).toEqual(0);
    });
  });

  describe("with 1 event in Redis", () => {
    it("should process 1 event", async () => {
      //Arrange
      const redis = mock<IRedis>();
      const bigQuery = mock<IBigQuery>();
      const eventString = {
        eventName: "test",
        eventData: { testKey1: 123, testKey2: "value" },
      };
      redis.lPopOne.mockResolvedValue(
        enrichEvent(eventString, ["lilysgarden"])
      );

      //Act
      const eventProcessor = new EventProcessor(
        redis,
        bigQuery,
        eventsNamespace
      );
      const processedEvents = await eventProcessor.processEvents();

      //Assert
      expect(processedEvents).toEqual(1);
    });
  });
});
