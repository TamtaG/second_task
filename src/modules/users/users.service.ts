import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/users/users.repository';
import { CommonQueryInterface } from 'src/utils/interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepo: UsersRepository) {}

  async fetchUsers(pagination: CommonQueryInterface) {
    const existingUsers = await this.usersRepo.getAllUsers();

    if (!existingUsers || !existingUsers.length) {
      const usersList = await this.usersRepo.getUsersWithApi();
      if (!usersList) {
        throw new Error('Unable to get users list');
      }

      await this.usersRepo.saveUsersToDb(usersList);
    }

    const result = await this.usersRepo.getUsersFromDb(pagination);
    return result;
  }
}
