import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text', nullable: true })
    name: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}