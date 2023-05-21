import {ApiProperty} from "@nestjs/swagger";
import {GetUserResponseDto} from "./get-user-response.dto";
import {PaginatedList} from "../../common/dto/paginated-list.dto";
import {User} from "../entities/user.entity";

export class GetUsersResponseDto extends PaginatedList {
  @ApiProperty({
    type: User,
    isArray: true,
    required: true,
  })
  list: User[];
}