import { RefundStatus } from '../../../entity/enums.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RefundDto {
  @ApiProperty()
  employee_id: number;
  @ApiProperty()
  category_id?: number;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  status?: RefundStatus;
}
