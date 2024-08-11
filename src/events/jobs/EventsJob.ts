import { IJob } from "../../jobSystem/IJob";
import { EventProcessor } from "../services/EventProcessor";

export class EventsJob implements IJob {
  constructor(private readonly eventProcessor: EventProcessor) {}

  async run(): Promise<boolean> {
    const eventsProcessed = await this.eventProcessor.processEvents();
    return eventsProcessed;
  }
}
