import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RefundStatus } from './enums.enum';
import { EmployeeEntity } from './employee.entity';
import { RefundCategoryEntity } from './refund-category.entity';

@Entity('refund')
export class RefundEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  employee_id: number;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.refunds, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
  @Column({ nullable: true })
  category_id: number | null;
  @ManyToOne(() => RefundCategoryEntity, (category) => category.refunds, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: RefundCategoryEntity | null;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;
  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.PENDENTE,
  })
  status: RefundStatus;
}
