import {ApiProperty} from "@nestjs/swagger";
import {GetEntityResponseDto} from "./get-entity-response.dto";
import {PaginatedList} from "../../common/dto/paginated-list.dto";
import {Address} from "../entities/address.entity";

export class GetEntitiesResponseDto extends PaginatedList {
  @ApiProperty({
    type: Address,
    isArray: true,
    required: true,
  })
  list: Address[];
}