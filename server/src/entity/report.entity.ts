import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportTypeEntity } from './report-type.entity';
import { ReportStatus, ReportFrequency } from './enums.enum';

@Entity('report')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 200 })
  name: string;
  @ManyToOne(() => ReportTypeEntity, (type) => type.reports, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'type_id' })
  type: ReportTypeEntity;
  @Column({
    type: 'enum',
    enum: ReportFrequency,
  })
  frequency: ReportFrequency;
  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PROCESSANDO,
  })
  status: ReportStatus;
  @Column({ type: 'char', length: 10, nullable: true })
  size?: string;
  @Column({ type: 'bytea', nullable: true })
  file?: Buffer;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
