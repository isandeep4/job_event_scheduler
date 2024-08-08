"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const EventCollector_1 = require("./services/EventCollector");
const GetStatus_1 = require("./services/GetStatus");
async function createEventsRouter(redis) {
    const router = (0, express_1.Router)({ mergeParams: true });
    const eventCollector = new EventCollector_1.EventCollector(redis);
    const getStatus = new GetStatus_1.GetStatus(redis);
    const validateEvent = [
        (0, express_validator_1.body)("eventName").isString().withMessage("Event name must be a string"),
        (0, express_validator_1.body)("eventTimestamp").isInt().withMessage("Must be a valid timestamp"),
        (0, express_validator_1.body)("installId")
            .isString()
            .withMessage("install id must be string")
            .notEmpty()
            .withMessage("install id is required and can not be empty"),
        (0, express_validator_1.body)("sessionId")
            .isString()
            .withMessage("sessionId must be a string")
            .isLength({ min: 3 })
            .withMessage("Session id must be valid"),
        (0, express_validator_1.body)("platform")
            .isString()
            .withMessage("platform must be a string")
            .notEmpty()
            .withMessage("platform is required and can not be empty"),
        (0, express_validator_1.body)("version")
            .isString()
            .withMessage("version must be a string")
            .notEmpty()
            .withMessage("version is required and can not be empty"),
        (0, express_validator_1.body)("eventData")
            .notEmpty()
            .withMessage("eventData is required and can not be empty"),
    ];
    router
        .post("/collect", validateEvent, async (req, res) => {
        console.log("/events/collect", req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.headers || !req.headers["x-tactile-game-id"]) {
            return res.status(404).send({ eventsCollected: 0 });
        }
        const game = req.headers["x-tactile-game-id"];
        const eventsCollected = await eventCollector.collectEvent(game, req.body);
        res.send({ eventsCollected });
    })
        .get("/status", async (req, res) => {
        console.log("/events/status");
        const events = await getStatus.get();
        res.send(events);
    });
    return router;
}
exports.createEventsRouter = createEventsRouter;
//# sourceMappingURL=router.js.map