import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
}
