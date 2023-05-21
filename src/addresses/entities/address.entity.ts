import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity('users_addresses')
@Unique(["id", "deleted"])
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  address_type: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  zip: number;

  @Column()
  street: string;

  @Column()
  house: string;

  @Column()
  block: string;

  @Column()
  apartments: string;

  @Column()
  coordinates: string;

  @Column()
  additional: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true, default: () => null })
  deleted: Date;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({name : 'user_id'})
  user: User
}
