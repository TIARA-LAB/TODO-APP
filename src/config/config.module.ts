import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';    
import {PrismaService} from '../prisma/prisma.sevice';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppConfigModule {}