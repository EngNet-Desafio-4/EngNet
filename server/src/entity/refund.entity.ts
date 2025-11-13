import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { RefundStatus } from './enums.enum';
import { EmployeeEntity } from './employee.entity';
import { CategoryEntity } from './category.entity';

@Entity('refund')
export class RefundEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => EmployeeEntity, (employee) => employee.refunds, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;
    @ManyToOne(() => CategoryEntity, (category) => category.refunds, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;
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