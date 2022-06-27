import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from 'src/books/books.module';
import { UserModule } from 'src/users/users.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationSchema } from './schemas/reservation.schema';

@Module({
  imports: [
    UserModule,
    BooksModule,
    MongooseModule.forFeature([
      { name: 'Reservation', schema: ReservationSchema },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationModule {}
