import {
  EventSubscriber,
  UpdateEvent,
  EntitySubscriberInterface,
} from 'typeorm';
import { Booking, BookingLog } from './entities';

@EventSubscriber()
export class BookingSubscriber implements EntitySubscriberInterface<Booking> {
  listenTo() {
    return Booking;
  }

  async afterUpdate(event: UpdateEvent<Booking>) {
    const { uuid, status } = event.entity;

    const logEntry = new BookingLog();
    logEntry.booking.uuid = uuid;
    logEntry.bookingStatus = status;

    const logRepository = event.manager.getRepository(BookingLog);
    await logRepository.save(logEntry);
  }
}
