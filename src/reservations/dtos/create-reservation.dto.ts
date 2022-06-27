import { IsArray, IsDateString, IsEnum, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';
import { ReservationStatus } from '../schemas/reservation-status.model';

export class CreateReservationDto {
  @IsMongoId()
  borrower: mongoose.Schema.Types.ObjectId;

  @IsArray()
  books: [mongoose.Schema.Types.ObjectId];

  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsDateString()
  deadline: string;
}
