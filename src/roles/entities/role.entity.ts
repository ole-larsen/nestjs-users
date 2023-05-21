import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Unique, ManyToMany, JoinTable
} from 'typeorm';
import {User} from "../../users/entities/user.entity";

@Entity('roles')
@Unique(["title", "deleted"])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true, default: () => null })
  deleted: Date;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[]
}