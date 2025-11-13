import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefundEntity } from './refund.entity';

@Entity('employee')
export class EmployeeEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'text', nullable: false })
    name: string;
    @Column({ type: 'text', unique: true })
    email: string;
    @Column({ type: 'char', length: 11, nullable: true })
    phone?: string;
    @Column({ type: 'bytea', nullable: true })
    photo?: Buffer;
    @Column({ type: 'date', nullable: true })
    birthday?: Date;
    @OneToMany(() => RefundEntity, (refund) => refund.employee)
    refunds: RefundEntity[];
}
