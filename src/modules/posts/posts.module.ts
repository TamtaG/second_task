import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepoModule } from 'src/repositories/posts/posts-repository.module';

@Module({
  imports: [PostsRepoModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
