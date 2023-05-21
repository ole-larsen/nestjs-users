import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty({
    type: Number,
    nullable: true,
    required: true,
  })
  id: number;

  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  enabled: boolean;

  @ApiProperty({
    type: Date,
    required: true,
  })
  created: Date;

  @ApiProperty({
    type: Date,
    required: true,
  })
  updated: Date;
}
