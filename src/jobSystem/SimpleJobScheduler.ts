import { IJob } from "./IJob";
import { IJobScheduler } from "./IJobScheduler";

interface SchedulerFunctions {
  nextTick: (callback: () => void) => void;
  setTimeout: (callback: () => void, delay: number) => NodeJS.Timeout;
}
const defaultSchedulerFunction: SchedulerFunctions = {
  nextTick: process.nextTick,
  setTimeout: setTimeout,
};

export class SimpleJobScheduler implements IJobScheduler {
  constructor(
    private readonly job: IJob,
    private readonly delayWhenNoWorkDone: number,
    private readonly schedulerFunctions: SchedulerFunctions = defaultSchedulerFunction
  ) {}

  public run() {
    this.scheduleNextTick();
  }

  private async runAndReschedule() {
    const workDone = await this.job.run();
    this.reschedule(workDone);
  }
  private reschedule(workDone: boolean) {
    if (workDone || this.delayWhenNoWorkDone <= 0) {
      this.scheduleNextTick();
    } else {
      this.scheduleDelayed();
    }
  }

  private scheduleNextTick() {
    this.schedulerFunctions.nextTick(() => {
      this.runAndReschedule();
    });
  }

  private scheduleDelayed() {
    this.schedulerFunctions.setTimeout(() => {
      this.runAndReschedule();
    }, this.delayWhenNoWorkDone);
  }
}
