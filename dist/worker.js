"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const BigQuery_1 = require("./bigquery/BigQuery");
const EventsJob_1 = require("./events/jobs/EventsJob");
const EventProcessor_1 = require("./events/services/EventProcessor");
const SimpleJobScheduler_1 = require("./jobSystem/SimpleJobScheduler");
const Redis_1 = require("./redis/Redis");
async function main() {
    dotenv_1.default.config();
    if (!process.env.BIG_QUERY_EVENTS_NAMESPACE) {
        throw new Error("Please make sure you have a .env file with a valid value for BIG_QUERY_EVENTS_NAMESPACE.");
    }
    const redis = await Redis_1.Redis.CreateAndConnect("redis://localhost:6379");
    const bigQuery = new BigQuery_1.BigQuery("tactile-codetest", "./auth/tactile-codetest.json");
    const eventProcessor = new EventProcessor_1.EventProcessor(redis, bigQuery, process.env.BIG_QUERY_EVENTS_NAMESPACE);
    const eventsJob = new EventsJob_1.EventsJob(eventProcessor);
    const simpleJobScheduler = new SimpleJobScheduler_1.SimpleJobScheduler(eventsJob, 1000);
    simpleJobScheduler.run();
}
main();
//# sourceMappingURL=worker.js.map