import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from '@/data/data-source';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'building-blocks/passport/jwt.strategy';
import configs from 'building-blocks/configs/configs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpContextMiddleware } from 'building-blocks/context/context';
import {PassengerModule} from '@/passenger/passenger.module';
import { OpenTelemetryModule } from 'building-blocks/openTelemetry/opentelemetry.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: configs.jwt.secret,
            signOptions: { expiresIn: configs.jwt.refreshExpirationDays }
        }),
        OpenTelemetryModule,
        TypeOrmModule.forRoot(postgresOptions),
        PassengerModule,
        RouterModule.register([
            {
                path: '/',
                module: PassengerModule
            }
        ])
    ],
    providers: [JwtStrategy]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpContextMiddleware).forRoutes('*');
    }
}
