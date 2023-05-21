import {ApiProperty} from "@nestjs/swagger";
import {GetEntityResponseDto} from "./get-entity-response.dto";
import {PaginatedList} from "../../common/dto/paginated-list.dto";
import {Profile} from "../entities/profile.entity";

export class GetEntitiesResponseDto extends PaginatedList {
  @ApiProperty({
    type: Profile,
    isArray: true,
    required: true,
  })
  list: Profile[];
}