import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Length } from 'class-validator';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(2, 50)
  street: string;

  @Column()
  @Length(2, 50)
  city: string;

  @Column()
  @Length(2, 50)
  state: string;

  @Column()
  @Length(2, 50)
  country: string;

  @Column()
  zipCode: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
