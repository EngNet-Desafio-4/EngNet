import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ unique: true, nullable: false })
  email: string;
  @Column()
  password: string;
}
