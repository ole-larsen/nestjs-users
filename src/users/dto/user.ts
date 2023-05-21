import {UserDtoInterface} from "../interfaces/user.interface";
import {Role} from "../../roles/entities/role.entity";
import {CreateUserDto} from "./create-user.dto";
import {UpdateUserDto} from "./update-user.dto";
import {User} from "../entities/user.entity";
import {Address} from "../../addresses/entities/address.entity";
import {Profile} from "../../profiles/entities/profile.entity";
import crypto, {randomBytes} from "crypto";

export class UserDto implements UserDtoInterface {
  id:      number | null;
  email:   string;
  password: string;
  password_reset_token: string;
  password_reset_expires: number;
  secret:  string;
  roles:   Role[];
  profile: Profile;
  addresses: Address[];
  auth_confirmation_token: string;
  enabled: boolean;
  created: Date;
  updated: Date;
  deleted: Date | null;

  constructor(id: number | null, email: string, password: string, roles: Role[], enabled: boolean, created: Date, updated: Date, deleted: Date | null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.enabled = enabled;
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }

  static create(createUserDto: CreateUserDto, roles: Role[]) {
    return new UserDto(
      null,
      createUserDto.email,
      createUserDto.password,
      roles,
      false,
      new Date(),
      new Date(),
      null
    );
  }

  static update(exists: User, updateUserDto: UpdateUserDto, roles: Role[]) {
    return new UserDto(
      exists.id,
      updateUserDto.email,
      updateUserDto.password,
      roles,
      updateUserDto.enabled,
      exists.created,
      new Date(),
      null
    );
  }

  private createRandomToken(): Promise<string> {
    return new Promise((resolve) => {
      randomBytes(16, (err:Error | null, buf: Buffer) => {
        resolve(buf.toString("hex"));
      });
    });
  }

  setConfirmationToken() {
    return new Promise((resolve) => {
      randomBytes(16, (err:Error | null, buf: Buffer) => {
        this.auth_confirmation_token = buf.toString("hex");
        resolve(true)
      });
    });
  }
}