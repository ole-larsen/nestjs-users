import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  constructor(id: number, confirmationCode: string) {
    this.id = id;
    this.confirmation_code = confirmationCode;
  }

  @ApiProperty({
    type: Number,
    required: true,
  })
  id: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  confirmation_code: string;
}