import { Column, Entity } from 'typeorm';
import { Role, UserEntity, UserGroup } from '../../user/entities/user.entity';
import { BaseModel } from '../base.model';

@Entity({ name: 'user' })
export class UserModel extends BaseModel implements UserEntity {
  @Column({ type: String, nullable: true })
  email?: string;

  @Column({ type: Boolean, nullable: true })
  emailVerified?: boolean;

  @Column({ type: Date, nullable: true })
  birthday?: Date;

  @Column({ type: String, nullable: true })
  displayName?: string;

  @Column({ type: String, nullable: true })
  avatar?: string;

  @Column({ enum: Role, type: String, array: true })
  roles: Role[];

  @Column({ enum: UserGroup, type: String, array: true, nullable: true })
  groups?: UserGroup[];

  @Column({ type: String, nullable: true })
  telegram?: string;

  @Column({ type: String, nullable: true })
  twitter?: string;
}
