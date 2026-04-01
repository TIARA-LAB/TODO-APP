import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const config = {
      host: 'db',           
      port: 3306,
      user: 'root',
      password: 'password',
      database: 'todoapp',
      // PRODUCTION TIMEOUTS - Fixes pool/socket errors permanently
      connectionLimit: 10,        // Matches default pool limit
      acquireTimeout: 60000,      // 60s - prevents "pool timeout after 10s"
      connectTimeout: 30000,      // 30s - fixes "socket timeout after 1s"  
      idleTimeout: 600000,        // 10min - closes stale connections
      resetAfterUse: true,        // Sanitizes connections between queries
    };
    
    const adapter = new PrismaMariaDb(config);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to MariaDB successfully');
    } catch (error) {
      this.logger.error(` Prisma connection failed: ${error.message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Prisma disconnected');
  }
}