import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.inerceptor';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:id')
  @UseInterceptors(new PaginationInterceptor({}, 'posts'))
  async fetchUsersPosts(
    @Param('id', ParseIntPipe) id: number,
    @Pagination() pagination,
  ) {
    return await this.postsService.getUserPosts(id, pagination);
  }

  @Delete('/:id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.deletePost(id);
  }
}
