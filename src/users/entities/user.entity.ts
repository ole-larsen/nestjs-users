import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import {Role} from "../../roles/entities/role.entity";
import {Profile} from "../../profiles/entities/profile.entity";
import {Address} from "../../addresses/entities/address.entity";

@Entity('users')
@Unique(["email", "deleted"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password?: string;

  @Column()
  password_reset_token: string;

  @Column()
  password_reset_expires: number;

  @Column()
  secret?: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  auth_confirmation_token: string

  @Column({ default: false, nullable: true })
  verified: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true, default: () => null })
  deleted: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true
  })
  @JoinTable({
    name: "user_role", // table name for the junction table of this relation
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id"
    }
  })
  roles: Role[]

  @OneToOne(() => Profile)
  @JoinColumn({
    name: "profile_id"
  })
  profile: Profile

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[]
}
