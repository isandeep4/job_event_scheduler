import { IJob } from "./IJob";
import { IJobScheduler } from "./IJobScheduler";

export class SimpleJobScheduler implements IJobScheduler {
    constructor(private readonly job: IJob, private readonly delayWhenNoWorkDone: number) {
    }

    public run() {
        this.scheduleNextTick();
    }

    private async runAndReschedule() {
        const workDone = await this.job.run();

        this.reschedule(workDone);
    }

    // TODO:
    // Add unit tests for this logic.
    // We need to dependency inject abstractions for nextTick and setTimout to write unit tests, though.
    // Will do this later...
    private reschedule(workDone: boolean) {
        if(workDone || this.delayWhenNoWorkDone <= 0) {
            this.scheduleNextTick();
        }
        else {
            this.scheduleDelayed();
        }
    }

    private scheduleNextTick() {
        process.nextTick(() => {
            this.runAndReschedule();
        });
    }

    private scheduleDelayed() {
        setTimeout(() => {
            this.runAndReschedule();
        }, this.delayWhenNoWorkDone);
    }
}
