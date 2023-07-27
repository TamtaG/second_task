import { Injectable } from '@nestjs/common';
import { PostsRepository } from 'src/repositories/posts/posts.repository';
import { CommonQueryInterface } from 'src/utils/interfaces';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepo: PostsRepository) {}

  async getUserPosts(userId: number, pagination: CommonQueryInterface) {
    const existingPosts = await this.postsRepo.findUsersPosts(userId);

    if (!existingPosts || !existingPosts.length) {
      const postsFromExternalSource = await this.postsRepo.getPostsWithApi(
        userId,
      );
      await this.postsRepo.savePostsToDb(postsFromExternalSource);
    }

    const result = await this.postsRepo.getUsersPostsFromDb(pagination);
    return result;
  }

  async deletePost(id: number) {
    return await this.postsRepo.deletePost(id);
  }
}
