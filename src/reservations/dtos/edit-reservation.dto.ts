import { ReservationStatus } from '../schemas/reservation-status.model';

export class EditReservationDto {
  status: ReservationStatus;
  comment: string;
  deadline: Date;
}
