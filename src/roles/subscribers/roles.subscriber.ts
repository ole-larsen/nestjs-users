import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Role } from '../entities/role.entity';

@EventSubscriber()
export class RolesSubscriber implements EntitySubscriberInterface<Role> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Role;
  }

  beforeInsert(event: InsertEvent<Role>) {
    console.log(`BEFORE ROLE INSERTED: `, event.entity);
  }
}