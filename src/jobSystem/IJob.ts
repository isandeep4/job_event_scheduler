export interface IJob {
    run() : Promise<boolean>;
}
