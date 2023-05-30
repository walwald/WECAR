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

    const logRepository = event.manager.getRepository(BookingLog);

    const logEntry = logRepository.create({
      booking: { uuid },
      bookingStatus: { id: status.id },
    });

    await logRepository.save(logEntry);
  }
}
