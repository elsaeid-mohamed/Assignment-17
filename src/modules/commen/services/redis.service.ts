import { config } from "dotenv";
import { createClient } from "redis";
import { BadRequestException } from "../response";

type RedisClient = ReturnType<typeof createClient>;

class RedisService {
  private client: RedisClient;

  constructor() {
    config();
    this.client = createClient({
      url: process.env.REDIS_URL as string,
    });
    this.handleEvent();
  }

  public async connection() {
    try {
      await this.client.connect();
      console.log("Redis connected successfully...");
    } catch (error) {
      console.error("Redis connection error:", error);
    }
  }

  private handleEvent() {
    this.client.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  // keys
  otpKey = (email: string) => `OTP::${email}`;
  otpCounterKey = (email: string) => `OTP::COUNTER::${email}`;
  forgetOtpKey = (email: string) => `OTP::FORGET_PASSWORD::${email}`;

  async get(key: string) {
    try {
      const result = await this.client.get(key);
      if (!result) return null;

      try {
        return JSON.parse(result);
      } catch {
        return result;
      }
    } catch (error) {
      console.log({ error });
      throw new BadRequestException("internal server error");
    }
  }

  async set({
    key,
    val,
    ttl,
  }: {
    key: string;
    val: unknown;
    ttl?: number;
  }) {
    try {
      const value = JSON.stringify(val);
      return ttl
        ? await this.client.set(key, value, { EX: ttl })
        : await this.client.set(key, value);
    } catch (error) {
      console.log({ error });
      throw new BadRequestException("internal server error");
    }
  }

  async delete(key: string) {
    return await this.client.del(key);
  }

  async ttl(key: string) {
    return await this.client.ttl(key);
  }

  async exists(key: string) {
    return await this.client.exists(key);
  }

  async incr(key: string) {
    return await this.client.incr(key);
  }

  async decr(key: string) {
    return await this.client.decr(key);
  }

  async keys(prefix: string) {
    return await this.client.keys(`${prefix}*`);
  }
}

const redisService = new RedisService();

export default redisService;