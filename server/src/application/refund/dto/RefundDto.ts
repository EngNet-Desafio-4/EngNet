import { RefundStatus } from '../../../entity/enums.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RefundDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  employeeId: number;
  @ApiProperty()
  categoryId?: number;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  requestDate?: Date;
  @ApiProperty()
  status?: RefundStatus;
}
