import {ApiProperty} from "@nestjs/swagger";
import {GetEntityResponseDto} from "./get-entity-response.dto";
import {PaginatedList} from "../../common/dto/paginated-list.dto";
import {Role} from "../entities/role.entity";

export class GetEntitiesResponseDto extends PaginatedList {
  @ApiProperty({
    type: Role,
    isArray: true,
    required: true,
  })
  list: Role[];
}