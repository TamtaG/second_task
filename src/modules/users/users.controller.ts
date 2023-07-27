import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.inerceptor';
import { QueryType } from 'src/common/enum/query-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(
    new PaginationInterceptor(
      {
        name: {
          search: true,
          type: QueryType.like,
          sort: true,
        },
      },
      'users',
    ),
  )
  async fetchUsers(@Pagination() pagination) {
    const result = await this.usersService.fetchUsers(pagination);
    return result;
  }
}
