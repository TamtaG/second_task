import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from 'src/common/base.entity';

@Entity({ name: 'user', schema: 'public' })
export class UserEntity extends BaseEntity {
  //if that was given to a user in an external source
  //we also have our own id as primary column in the base entity
  @Column('int')
  externalId: number;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  username: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('varchar', { nullable: false })
  address: string;

  @Column('varchar', { nullable: false })
  phone: string;

  @Column('varchar', { nullable: false })
  website: string;

  //Company can also be a seperate entity later, joined with user's entity
  @Column('varchar')
  companyName: string;

  @Column('varchar')
  companyCatchPhrase: string;

  @Column('varchar')
  companyBs: string;
}
