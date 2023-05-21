import { EntitySchemaColumnOptions } from "typeorm"

export const BaseColumnSchemaPart = {
  enabled: {
    name: "enabled",
    type: "boolean",
    default: true,
  } as EntitySchemaColumnOptions,
  created: {
    name: "created",
    type: "timestamp with time zone",
    createDate: true,
  } as EntitySchemaColumnOptions,
  updated: {
    name: "updated",
    type: "timestamp with time zone",
    updateDate: true,
  } as EntitySchemaColumnOptions,
  deleted: {
    name: "deleted",
    type: "timestamp with time zone",
    updateDate: false,
  } as EntitySchemaColumnOptions,
}