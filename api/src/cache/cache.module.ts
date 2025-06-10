import { Module } from '@nestjs/common'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config'

@Module({
	imports: [
		RedisModule.forRootAsync({
			imports: [],
			inject: [ConfigService],
			useFactory: async(configService: ConfigService): Promise<RedisModuleOptions> => ({
				type: 'single', // or 'cluster' if using Redis Cluster
        		url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
			}),
		}),
	],
	exports: [RedisModule],
})

export class CacheModule {}