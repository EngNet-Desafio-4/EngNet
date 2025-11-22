import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  photo?: string;
  @ApiProperty()
  birthday?: Date;
}
