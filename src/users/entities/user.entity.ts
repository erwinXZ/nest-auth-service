import { ApiProperty } from '@nestjs/swagger';
import { Token } from 'src/token/entities/token.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'admin' })
  username: string;

  @Column()
  @ApiProperty({ example: 'password123' })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '2023-06-18T12:00:00.000Z' })
  lastLogin: Date;

  @CreateDateColumn()
  @ApiProperty({ example: '2023-06-18T12:00:00.000Z' })
  created: Date;

  @UpdateDateColumn({ nullable: true })
  @ApiProperty({ example: '2023-06-18T12:00:00.000Z' })
  modified: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: 1 })
  modifiedBy: number;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @BeforeInsert()
  async beforeInsert() {
    this.created = new Date();
    this.modified = null;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.modified = new Date();
  }
}
