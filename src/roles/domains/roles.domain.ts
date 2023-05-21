import {Role} from "../entities/role.entity";

export class RolesDomain {
  private readonly _id: number;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _enabled: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _deletedAt: Date | null;

  constructor(
    id: number,
    title: string,
    description: string,
    enabled: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._enabled = enabled;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
  }

  toEntity(): Role {
    const role = new Role();

    role.id = this._id;
    role.title = this._title;
    role.description = this._description;
    role.enabled = this._enabled;
    role.created = this._createdAt;
    role.updated = this._updatedAt;
    role.deleted = this._deletedAt;

    return role;
  }

  toJSON(): RolesDomain {
    return {
      ...this
    };
  }
}