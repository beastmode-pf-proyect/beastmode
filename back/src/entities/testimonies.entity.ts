import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./users.entity";  
    @Entity("testimonies")
    export class Testimony {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    fullName: string;

    @Column({ type: "int", unsigned: true })
    age: number;

    @Column({ length: 100 })
    occupation: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "numeric", precision: 2, scale: 1 })
    score: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: false })
    isApproved: boolean;

    @Column({ default: true })
    isActive: boolean;

    // Relación ManyToOne con User
    @ManyToOne(() => User, (user) => user.testimonies)
    user: User;
}