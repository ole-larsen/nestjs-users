import {Role} from "../../roles/entities/role.entity";
import {Profile} from "../../profiles/entities/profile.entity";
import {Address} from "../../addresses/entities/address.entity";

export interface UserDtoInterface {
  id:      number | null;
  email:   string;
  roles:   Role[];
  profile: Profile;
  addresses: Address[];
  enabled: boolean;
  created: Date;
  updated: Date;
  deleted: Date | null;
}