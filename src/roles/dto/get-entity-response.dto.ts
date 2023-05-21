import { ApiProperty } from '@nestjs/swagger';

export class GetEntityResponseDto {
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
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  description: string;

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
