import dotenv from "dotenv";
import { BigQuery } from "./bigquery/BigQuery";
import { EventsJob } from "./events/jobs/EventsJob";
import { EventProcessor } from "./events/services/EventProcessor";
import { SimpleJobScheduler } from "./jobSystem/SimpleJobScheduler";
import { Redis } from "./redis/Redis";

async function main() {
    dotenv.config();

    if(!process.env.BIG_QUERY_EVENTS_NAMESPACE) {
        throw new Error("Please make sure you have a .env file with a valid value for BIG_QUERY_EVENTS_NAMESPACE.");
    }

    const redis = await Redis.CreateAndConnect("redis://localhost:6379");
    const bigQuery = new BigQuery("tactile-codetest", "./auth/tactile-codetest.json");

    const eventProcessor = new EventProcessor(redis, bigQuery, process.env.BIG_QUERY_EVENTS_NAMESPACE);
    const eventsJob = new EventsJob(eventProcessor);
    const simpleJobScheduler = new SimpleJobScheduler(eventsJob, 1000);

    simpleJobScheduler.run();
}

main();
