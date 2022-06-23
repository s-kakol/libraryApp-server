import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './middleware/requestLogger.middleware';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigurationService } from './config/configuration.service';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        const options: MongooseModuleOptions = {
          uri: configurationService.dbConnectionString,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryWrites: true,
          w: 'majority',
        };

        return options;
      },
    }),
    // MongooseModule.forRoot(
    //   'mongodb+srv://fs-mongo:admin1@cluster0.4n0ze.mongodb.net/libraryApp',
    // ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('');
  }
}
