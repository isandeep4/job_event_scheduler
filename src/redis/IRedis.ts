import { RedisMemoryStats } from "./RedisMemoryStats";

export interface IRedis {
  rPush(key: string, element: string): Promise<number>;
  lPopOne(key: string): Promise<string>;
  lRange(key: string, start: number, stop: number): Promise<string[]>;
  memoryStats(): Promise<RedisMemoryStats>;
  lTrim(key: string, length: number, stop: number);
}
