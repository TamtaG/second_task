import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import BaseEntity from 'src/common/base.entity';
import { UserEntity } from 'src/modules/users/entities';

@Entity('post')
export class PostEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: number | UserEntity;

  @RelationId((post: PostEntity) => post.user)
  userId: number;

  @Column('int', { nullable: false })
  externalId: number;

  @Column('varchar')
  title: string;

  @Column('varchar', { nullable: true })
  body: string;
}
