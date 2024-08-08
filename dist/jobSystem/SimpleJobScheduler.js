"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleJobScheduler = void 0;
class SimpleJobScheduler {
    constructor(job, delayWhenNoWorkDone) {
        this.job = job;
        this.delayWhenNoWorkDone = delayWhenNoWorkDone;
    }
    run() {
        this.scheduleNextTick();
    }
    async runAndReschedule() {
        const workDone = await this.job.run();
        this.reschedule(workDone);
    }
    // TODO:
    // Add unit tests for this logic.
    // We need to dependency inject abstractions for nextTick and setTimout to write unit tests, though.
    // Will do this later...
    reschedule(workDone) {
        if (workDone || this.delayWhenNoWorkDone <= 0) {
            this.scheduleNextTick();
        }
        else {
            this.scheduleDelayed();
        }
    }
    scheduleNextTick() {
        process.nextTick(() => {
            this.runAndReschedule();
        });
    }
    scheduleDelayed() {
        setTimeout(() => {
            this.runAndReschedule();
        }, this.delayWhenNoWorkDone);
    }
}
exports.SimpleJobScheduler = SimpleJobScheduler;
//# sourceMappingURL=SimpleJobScheduler.js.map