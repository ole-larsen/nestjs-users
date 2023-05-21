import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity('users_profiles')
@Unique(["username", "deleted"])
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  user_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  birthdate: Date;

  @Column()
  about: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true, default: () => null })
  deleted: Date;

  @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
  @JoinColumn({
    name: "user_id"
  })
  user: User
}
