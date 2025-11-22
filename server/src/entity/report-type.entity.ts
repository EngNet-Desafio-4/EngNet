import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity('report_type')
export class ReportTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'char', length: 30, unique: true })
  name: string;
  @OneToMany(() => ReportEntity, (report) => report.type)
  reports: ReportEntity[];
}
