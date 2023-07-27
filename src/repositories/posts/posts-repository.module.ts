import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/modules/posts/entities';
import { PostsRepository } from './posts.repository';
import { UserEntity } from 'src/modules/users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  providers: [PostsRepository],
  exports: [PostsRepository],
})
export class PostsRepoModule {}
