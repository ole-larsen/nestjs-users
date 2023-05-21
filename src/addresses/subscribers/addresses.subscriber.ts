import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import {Address} from "../entities/address.entity";

@EventSubscriber()
export class AddressesSubscriber implements EntitySubscriberInterface<Address> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Address;
  }

  beforeInsert(event: InsertEvent<Address>) {
    console.log(`BEFORE ADDRESS INSERTED: `, event.entity);
  }
}