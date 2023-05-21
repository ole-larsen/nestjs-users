import {Repository} from "typeorm";
import {Role} from "../entities/role.entity";
import {RoleDto} from "../interfaces/role.dto.interface";

export class RolesRepository extends Repository<Role> {
  createRole = async (roleDto: RoleDto) => {
    return await this.save(roleDto);
  };
}