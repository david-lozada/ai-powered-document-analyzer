import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from 'ioredis'

@Injectable()
export class CacheService {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async set(key:string, value: string, ttlSeconds: number = 60 * 60 * 24) {
		await this.redis.setex(key, ttlSeconds, value) 
	}
}