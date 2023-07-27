import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepoModule } from 'src/repositories/users/users-repository.module';

@Module({
  imports: [UsersRepoModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
