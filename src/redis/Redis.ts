import { createClient, RedisClientType } from "redis";
import { IRedis } from "./IRedis";
import { RedisMemoryStats } from "./RedisMemoryStats";

export class Redis implements IRedis {
  private readonly client: RedisClientType;

  static async CreateAndConnect(url: string): Promise<Redis> {
    const redis = new Redis(url);
    await redis.connect();
    return redis;
  }

  constructor(url: string) {
    this.client = createClient({ url });

    this.client.on("error", (error) => {
      const theError = error.origin
        ? error.origin.toString()
        : error.toString();
      console.log(`Redis: Error - ${theError}`);

      console.log(`Redis: Signaling self-termination`);
      process.kill(process.pid, "SIGTERM");
    });

    this.client.on("warning", (warning) => {
      console.log(`Redis: Warning - ` + warning);
    });

    this.client.on("ready", () => {
      //this.ready = true;
      console.log(`Redis: Connected`);
    });

    this.client.on("end", () => {
      //this.ready = false;
      console.log(`Redis: Disconnected`);
    });
  }

  public async connect() {
    return await this.client.connect();
  }

  public async rPush(key: string, element: string): Promise<number> {
    return await this.client.rPush(key, element);
  }

  public async lPopOne(key: string): Promise<string> {
    return await this.client.lPop(key);
  }

  public async lRange(
    key: string,
    start: number,
    stop: number
  ): Promise<string[]> {
    return await this.client.lRange(key, start, stop);
  }

  public async memoryStats(): Promise<RedisMemoryStats> {
    //What is the type returned from memory stats?
    return (await this.client.memoryStats()) as RedisMemoryStats;
  }
}
