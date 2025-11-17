import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefundEntity } from './refund.entity';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 200, unique: true })
  name: string;
  @OneToMany(() => RefundEntity, (refund) => refund.category)
  refunds: RefundEntity[];
}
