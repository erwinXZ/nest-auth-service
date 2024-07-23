
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  type: string;

  @ManyToOne(() => User, user => user.tokens)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}