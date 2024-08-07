import { Router } from "express";
import { body, validationResult } from "express-validator";
import { IRedis } from "../redis/IRedis";
import { EventCollector } from "./services/EventCollector";
import { GetStatus } from "./services/GetStatus";

export async function createEventsRouter(redis: IRedis): Promise<Router> {
  const router = Router({ mergeParams: true });
  const eventCollector = new EventCollector(redis);
  const getStatus = new GetStatus(redis);

  const validateEvent = [
    body("eventName").isString().withMessage("Event name must be a string"),
    body("eventTimestamp").isInt().withMessage("Must be a valid timestamp"),
    body("installId")
      .isString()
      .withMessage("install id must be string")
      .notEmpty()
      .withMessage("install id is required and can not be empty"),
    body("sessionId")
      .isString()
      .withMessage("sessionId must be a string")
      .isLength({ min: 3 })
      .withMessage("Session id must be valid"),
    body("platform")
      .isString()
      .withMessage("platform must be a string")
      .notEmpty()
      .withMessage("platform is required and can not be empty"),
    body("version")
      .isString()
      .withMessage("version must be a string")
      .notEmpty()
      .withMessage("version is required and can not be empty"),
    body("eventData")
      .notEmpty()
      .withMessage("eventData is required and can not be empty"),
  ];

  router
    .post("/collect", validateEvent, async (req, res) => {
      console.log("/events/collect");

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.headers || !req.headers["x-tactile-game-id"]) {
        return res.status(404).send({ eventsCollected: 0 });
      }

      const game = req.headers["x-tactile-game-id"];
      const eventsCollected = await eventCollector.collectEvent(
        game as string,
        req.body as object
      );

      res.send({ eventsCollected });
    })
    .get("/status", async (req, res) => {
      console.log("/events/status");

      const events = await getStatus.get();

      res.send(events);
    });

  return router;
}
