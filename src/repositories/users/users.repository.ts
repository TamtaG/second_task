import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/common/Interfaces/user.interface';
import { UserEntity } from 'src/modules/users/entities';
import { CommonQueryInterface } from 'src/utils/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  //fetches the users' list with an external api
  async getUsersWithApi() {
    try {
      const apiUrl = 'https://jsonplaceholder.typicode.com/users';
      const users = await axios.get(apiUrl);
      return users.data;
    } catch (error) {
      //More specific error-handling can be added in the future
      console.error('Error fetching users:', error.message);
      throw new Error('Failed to fetch users');
    }
  }

  //Saves the users' list to local DB
  async saveUsersToDb(data: User[]) {
    try {
      data.forEach(async (user) => {
        const newUser = new UserEntity();
        newUser.id = user.id;
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.address = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
        newUser.phone = user.phone;
        newUser.website = user.website;
        newUser.companyName = user.company.name;
        newUser.companyCatchPhrase = user.company.catchPhrase;
        newUser.companyBs = user.company.bs;

        await this.usersRepo.save(newUser);
      });
    } catch (error) {
      console.log('Could not save users: ', error.message);
      throw new Error('Failed to save users');
    }
  }

  async getUsersFromDb(pagination: CommonQueryInterface) {
    try {
      const queryBuilder = this.usersRepo.createQueryBuilder('users');

      const [items, count] = await Promise.all([
        queryBuilder
          .orderBy(pagination.sort)
          .skip(pagination.pagination.skip)
          .take(pagination.pagination.limit)
          .getMany(),
        queryBuilder.getCount(),
      ]);

      return { items, count };
    } catch (error) {
      console.error('Error fetching users from the database:', error.message);
      throw new Error('Failed to fetch users from the database');
    }
  }

  async getAllUsers() {
    const result = await this.usersRepo.find();
    return result;
  }
}
