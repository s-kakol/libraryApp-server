import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { EditReservationDto } from './dtos/edit-reservation.dto';
import { ReservationsService } from './reservations.service';
import { Reservation } from './schemas/reservation.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async getReservations(): Promise<Reservation[]> {
    return await this.reservationsService.findAll();
  }

  @Get('/:id')
  async getReservation(@Param('id') id: string): Promise<Reservation> {
    return await this.reservationsService.findOneById(id);
  }

  @Get('/user/:id')
  async getReservationsByUser(@Param('id') id: string): Promise<Reservation[]> {
    return await this.reservationsService.findAllByBorrowerId(id);
  }

  @Post()
  async addReservation(
    @Body() body: CreateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationsService.create(body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteReservation(@Param('id') id: string): Promise<void> {
    await this.reservationsService.remove(id);
  }

  @Patch('/:id')
  async patchReservation(
    @Param('id') id: string,
    @Body() body: EditReservationDto,
  ): Promise<Reservation> {
    return await this.reservationsService.edit(id, body);
  }
}
