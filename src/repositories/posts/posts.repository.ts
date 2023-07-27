import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Post } from 'src/common/Interfaces/post.interface';
import { PostEntity } from 'src/modules/posts/entities';
import { UserEntity } from 'src/modules/users/entities';
import { CommonQueryInterface } from 'src/utils/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class PostsRepository {
  private readonly logger = new Logger(PostsRepository.name);
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async getPostsWithApi(userId: number) {
    try {
      const apiUrl = `//jsonplaceholder.typicode.com/posts?userId=${userId}`;
      const posts = await axios.get(apiUrl);
      return posts.data;
    } catch (error) {
      //More specific error-handling can be added in the future
      console.error('Error fetching posts:', error.message);
      throw new Error('Failed to fetch posts');
    }
  }

  //Saves the users' posts to local DB
  async savePostsToDb(data: Post[]) {
    try {
      data.forEach(async (post) => {
        const newPost = new PostEntity();
        newPost.externalId = post.id;
        newPost.user = post.userId;
        newPost.title = post.title;
        newPost.body = post.body;

        await this.postsRepo.save(newPost);
      });
    } catch (error) {
      console.log('Could not save posts: ', error.message);
      throw new Error('Failed to save posts');
    }
  }

  async findUsersPosts(userId: number) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      if (!user) {
        return 'No such user found';
      }

      const posts = await this.postsRepo
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .getMany();

      return posts;
    } catch (error) {
      console.log('Could not get posts: ', error.message);
      throw new Error('Failed to get posts');
    }
  }

  async getUsersPostsFromDb(pagination: CommonQueryInterface) {
    try {
      const queryBuilder = this.postsRepo.createQueryBuilder('posts');

      const [items, count] = await Promise.all([
        queryBuilder
          .skip(pagination.pagination.skip)
          .take(pagination.pagination.limit)
          .getMany(),
        queryBuilder.getCount(),
      ]);

      return { items, count };
    } catch (error) {
      console.error('Error fetching posts from the database:', error.message);
      throw new Error('Failed to fetch posts from the database');
    }
  }

  async deletePost(id) {
    const { affected } = await this.postsRepo.softDelete({
      id,
    });

    if (!affected) throw new Error('The post does not exist');

    return `Post with id: ${id} - was deleted successfully! `;
  }
}
