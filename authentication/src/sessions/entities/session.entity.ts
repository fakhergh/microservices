import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  userType: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  createdAt: Date;
}
