import {Router} from "express";
import { IRedis } from "../redis/IRedis";
import { EventCollector } from "./services/EventCollector";
import { GetStatus } from "./services/GetStatus";

export async function createEventsRouter(
    redis: IRedis
): Promise<Router> {
    const router = Router({mergeParams: true});
    const eventCollector = new EventCollector(redis);
    const getStatus = new GetStatus(redis);

    router
        .post("/collect", async(req, res) => {
            console.log("/events/collect");

            if(!req.headers || !req.headers['x-tactile-game-id']) {
                return res.status(404).send({eventsCollected: 0});
            }

            const game = req.headers['x-tactile-game-id'];
            const eventsCollected = await eventCollector.collectEvent(game as string, req.body as string);

            res.send({eventsCollected});
        })
        .get("/status", async(req, res) => {
            console.log("/events/status");

            const events = await getStatus.get();

            res.send(events);
        });

    return router;
}
