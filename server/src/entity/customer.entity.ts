import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CustomerStatus } from './enums.enum';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 200 })
  name: string;
  @Column({ type: 'text', unique: true })
  email: string;
  @Column({ type: 'char', length: 11, nullable: true })
  phone?: string;
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalPurchases: number;
  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.NOVO,
  })
  status: CustomerStatus;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
