import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("maps")
export class GymLocation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;
  
    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;
  
    @Column({ nullable: true })
    details?: string;
}