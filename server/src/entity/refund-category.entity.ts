import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefundEntity } from './refund.entity';

@Entity('refund_category')
export class RefundCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 200, unique: true })
  name: string;
  @OneToMany(() => RefundEntity, (refund) => refund.category_id)
  refunds: RefundEntity[];
}
