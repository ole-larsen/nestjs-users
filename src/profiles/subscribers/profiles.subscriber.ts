import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import {Profile} from "../entities/profile.entity";

@EventSubscriber()
export class ProfilesSubscriber implements EntitySubscriberInterface<Profile> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Profile;
  }

  beforeInsert(event: InsertEvent<Profile>) {
    console.log(`BEFORE PROFILE INSERTED: `, event.entity);
  }
}