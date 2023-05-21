import {EntitySchema} from 'typeorm';
import { Role } from '../entities/role.entity';
import {BaseColumnSchemaPart} from "../../system/helpers/schema.helper";

export const RoleSchema = new EntitySchema<Role>({
  name: 'Role',
  target: Role,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    ...BaseColumnSchemaPart,
  },
});