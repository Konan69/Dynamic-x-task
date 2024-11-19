// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { CoreEntity } from "./core.entity";
// import { TaskEntity } from "./task.entity";

// @Entity("status")
// export class StatusEntity extends CoreEntity {
//   @PrimaryGeneratedColumn("uuid")
//   uuid: string;

//   @Column({ type: "varchar", nullable: false, unique: true })
//   status: string;

//   @OneToMany("TaskEntity", "status", {
//     cascade: true,
//     eager: false,
//   })
//   tasks: TaskEntity[];
// }
