import { ApiProperty } from '@nestjs/swagger';

export class LogindDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
