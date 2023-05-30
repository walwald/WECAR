import {
  EventSubscriber,
  UpdateEvent,
  EntitySubscriberInterface,
} from 'typeorm';
import { Payment, PaymentLog } from './entities';

@EventSubscriber()
export class PaymentSubscriber implements EntitySubscriberInterface<Payment> {
  listenTo() {
    return Payment;
  }

  async afterUpdate(event: UpdateEvent<Payment>) {
    const { id, status } = event.entity;

    const logRepository = event.manager.getRepository(PaymentLog);

    const logEntry = logRepository.create({
      payment: { id },
      paymentStatus: { id: status.id },
    });

    await logRepository.save(logEntry);
  }
}
