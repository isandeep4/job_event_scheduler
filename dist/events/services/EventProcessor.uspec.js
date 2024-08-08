"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const eventEnrichment_1 = require("../utils/eventEnrichment");
const EventProcessor_1 = require("./EventProcessor");
describe("EventProcessor", () => {
    const eventsNamespace = "test";
    describe("with no events in Redis", () => {
        it("should process 0 events", async () => {
            //Arrange
            const redis = (0, jest_mock_extended_1.mock)();
            const bigQuery = (0, jest_mock_extended_1.mock)();
            //Act
            const eventProcessor = new EventProcessor_1.EventProcessor(redis, bigQuery, eventsNamespace);
            const processedEvents = await eventProcessor.processEvents();
            //Assert
            expect(processedEvents).toEqual(0);
        });
    });
    describe("with 1 event in Redis", () => {
        it("should process 1 event", async () => {
            //Arrange
            const redis = (0, jest_mock_extended_1.mock)();
            const bigQuery = (0, jest_mock_extended_1.mock)();
            const eventString = {
                eventName: "test",
                eventData: { testKey1: 123, testKey2: "value" },
            };
            redis.lPopOne.mockResolvedValue((0, eventEnrichment_1.enrichEvent)(eventString, ["lilysgarden"]));
            //Act
            const eventProcessor = new EventProcessor_1.EventProcessor(redis, bigQuery, eventsNamespace);
            const processedEvents = await eventProcessor.processEvents();
            //Assert
            expect(processedEvents).toEqual(1);
        });
    });
});
//# sourceMappingURL=EventProcessor.uspec.js.map