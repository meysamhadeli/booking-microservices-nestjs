import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from './data/data-source';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { OpenTelemetryModule } from 'building-blocks/openTelemetry/open-telemetry.module';
import { JwtStrategy } from 'building-blocks/passport/jwt.strategy';
import { BookingModule } from './booking/booking.module';
import configs from 'building-blocks/configs/configs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpContextMiddleware } from 'building-blocks/context/context';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configs.jwt.secret,
      signOptions: { expiresIn: configs.jwt.refreshExpirationDays }
    }),
    OpenTelemetryModule.forRoot(),
    TypeOrmModule.forRoot(postgresOptions),
    BookingModule,
    RouterModule.register([
      {
        path: '/',
        module: BookingModule
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
