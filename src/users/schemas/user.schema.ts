import {Column, EntitySchema} from 'typeorm';
import { User } from '../entities/user.entity';
import {BaseColumnSchemaPart} from "../../system/helpers/schema.helper";

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    email: {
      type: String,
      nullable: false,
      unique: true,
    },
    password: {
      type: String,
      nullable: false,
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: String,
    },
    secret: {
      type: String,
    },
    ...BaseColumnSchemaPart,
  },
});