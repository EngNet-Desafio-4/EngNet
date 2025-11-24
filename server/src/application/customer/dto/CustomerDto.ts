import { CustomerStatus } from '../../../entity/enums.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  totalPurchases?: number;
  @ApiProperty()
  status?: CustomerStatus;
}
