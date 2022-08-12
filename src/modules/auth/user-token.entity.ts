import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  refresh_token: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;
}
