export enum ReservationStatus {
  PROCESSED = 'PROCESSED', //User is picking books on client-side
  CONFIRMED = 'CONFIRMED', //User has sent reservation to server
  BORROWED = 'BORROWED', //User picked up books at library
  RETURNED = 'RETURNED', //User returned books to library in time
  PAST_DEADLINE = 'PAST DEADLINE', //User hasn't returned books past deadline
  PAID = 'PAID', //User paid for returning after deadline or damages (explained in comment)
  CANCELLED = 'CANCELLED', //User cancelled reservation after confirming it but before borrowing
}
