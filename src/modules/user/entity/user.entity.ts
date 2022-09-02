import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashPasswordTransform } from '../../../shared/helper/crypto';
import { Permission } from '../enum/permission.enum';
import { Role } from '../enum/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    transformer: hashPasswordTransform,
    select: false,
  })
  password: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('enum', {
    array: true,
    enum: Object.values(Role),
    default: [Role.role_user],
  })
  roles: Role[];

  @Column('enum', {
    array: true,
    enum: Object.values(Permission),
    default: [Permission.permission_user_get],
  })
  permissions: Permission[];
}
