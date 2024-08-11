import { SimpleJobScheduler } from "./SimpleJobScheduler";
import { IJob } from "./IJob";

describe("SimpleJobScheduler", () => {
  xit("should reschedule using nextTick when work is done", async () => {
    const mockNextTick = jest.fn((callback) => callback());
    const mockSetTimeOut = jest.fn();
    const schedulerFunctions = {
      nextTick: mockNextTick,
      setTimeout: mockSetTimeOut,
    };

    const mockJob: IJob = {
      run: jest.fn().mockResolvedValue(true),
    };

    const scheduler = new SimpleJobScheduler(mockJob, 1000, schedulerFunctions);
    scheduler.run();

    expect(mockNextTick).toHaveBeenCalled();
    expect(mockSetTimeOut).not.toHaveBeenCalled();
  });
  it("should reschedule using setTimeout when no work is done", async (done) => {
    jest.useFakeTimers(); // Use fake timers

    const mockNextTick = jest.fn((callback) => callback());
    const mockSetTimeout = jest.fn((callback, delay): NodeJS.Timeout => {
      expect(delay).toBe(1000);
      callback();
      done();
      return setTimeout(callback, delay);
    });

    const schedulerFunctions = {
      nextTick: mockNextTick,
      setTimeout: mockSetTimeout,
    };

    const mockJob: IJob = {
      run: jest.fn().mockResolvedValue(false),
    };

    const scheduler = new SimpleJobScheduler(mockJob, 1000, schedulerFunctions);
    scheduler.run();
    jest.runAllTimers();
    expect(mockJob.run).toHaveBeenCalled();
    //expect(mockNextTick).not.toHaveBeenCalled();
    expect(mockSetTimeout).toHaveBeenCalled();
  });
});
