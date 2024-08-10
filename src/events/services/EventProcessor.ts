import { IBigQuery } from "../../bigquery/IBigQuery";
import { IRedis } from "../../redis/IRedis";
import { parseEnrichedEvent } from "../utils/eventEnrichment";
import fs from "fs";
import path from "path";
import os from "os";

export class EventProcessor {
  constructor(
    private readonly redis: IRedis,
    private readonly bigQuery: IBigQuery,
    private readonly eventsNamespace: string
  ) {}

  async processEvents(): Promise<boolean> {
    try {
      const eventStrings = await this.redis.lRange("events", 0, 99);
      const rows = [];
      let game;
      if (eventStrings.length > 0) {
        if (rows.length === 1) {
          // Directly insert the single event to BigQuery
          const parsedEvent = parseEnrichedEvent(eventStrings[0]);
          const game = parsedEvent.enrichmentData[0];
          await this.bigQuery.insertRows(
            "events_" + this.eventsNamespace,
            game,
            rows
          );
        } else {
          // Batch processing
          for (const event of eventStrings) {
            const parsedEvent = parseEnrichedEvent(event);
            game = parsedEvent.enrichmentData[0];
            rows.push(parsedEvent.event);
          }
          const tempFilePath = path.join(
            os.tmpdir(),
            `bq_load_${Date.now()}.json`
          );

          fs.writeFileSync(tempFilePath, JSON.stringify(rows, null, 2));

          // load the data from the temporary file into BigQuery

          await this.bigQuery.loadBatch(
            "events_" + this.eventsNamespace,
            game,
            tempFilePath
          );
          fs.unlinkSync(tempFilePath);
        }

        await this.redis.lTrim("events", eventStrings.length, -1);

        return true;
      } else {
        console.log("No events to process.");
        return false; // No work was done
      }
    } catch (error) {
      console.error("Error loading JSON to BigQuery:", error);
      return false; // Handle errors and indicate that no work was successfully completed
    }
  }
}
