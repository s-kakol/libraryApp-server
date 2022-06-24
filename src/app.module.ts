import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './middleware/requestLogger.middleware';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigurationService } from './config/configuration.service';
import { BooksModule } from './books/books.module';
import { UserModule } from './users/users.module';

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
    BooksModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('');
  }
}
