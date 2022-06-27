import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BooksService } from 'src/books/books.service';
import { UserService } from 'src/users/users.service';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { EditReservationDto } from './dtos/edit-reservation.dto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    private readonly bookService: BooksService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return await this.reservationModel.find({}).exec();
  }

  async findAllByBorrowerId(borrower: string): Promise<Reservation[]> {
    if (!mongoose.isValidObjectId(borrower))
      throw new BadRequestException('Malformed or wrong id');
    return await this.reservationModel.find({ borrower }).exec();
  }

  async findOneById(id: string): Promise<Reservation> {
    let result: Reservation;
    try {
      result = await this.reservationModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException('Malformed or wrong id');
    }
    if (!result) {
      throw new NotFoundException('Could not find reservation with given id.');
    }
    return result;
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const createdReservation = new this.reservationModel(createReservationDto);

    const refUser = await this.userService.findOneById(
      createReservationDto.borrower.toString(),
    );

    try {
      createdReservation.createdAt = new Date();
      createdReservation.comment = '';
      const newReservation = await createdReservation.save();

      refUser.reservations = refUser.reservations.concat(newReservation._id);
      await refUser.save();

      newReservation.books.forEach(async (bookId) => {
        const refBook = await this.bookService.findOneById(bookId.toString());
        refBook.copiesAvailable--;
        await refBook.save();
      });

      return newReservation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.reservationModel.findById(id).exec();
    const books = reservation.books;
    const refUser = await this.userService.findOneById(
      reservation.borrower.toString(),
    );

    const result = await this.reservationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find reservation with given id.');
    }

    refUser.reservations = refUser.reservations.filter(
      (reservation) => reservation.toString() !== id,
    );
    await refUser.save();

    books.forEach(async (bookId) => {
      const refBook = await this.bookService.findOneById(bookId.toString());
      refBook.copiesAvailable++;
      await refBook.save();
    });
  }

  async edit(id: string, editReservationData: EditReservationDto) {
    return await this.reservationModel.findByIdAndUpdate(
      id,
      editReservationData,
      {
        new: true,
      },
    );
  }
}
