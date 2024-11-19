import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CoreEntity } from "./core.entity";
import { UserEntity } from "./user.entity";
// import { StatusEntity } from "./status.entity";

@Entity("task")
export class TaskEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  title: string;

  // @Column({ type: "int", nullable: false })
  // position: number;

  @ManyToOne(() => UserEntity, (user) => user.tasks, {
    nullable: false,
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  user: UserEntity;

  // @ManyToOne("StatusEntity", "tasks", {
  //   nullable: false,
  //   onDelete: "CASCADE",
  //   orphanedRowAction: "delete",
  // })

  @Column({ type: "varchar", nullable: false })
  status: string;
}
