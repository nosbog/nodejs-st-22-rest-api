import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  users: User[] = [];

  findMany(limit: number, loginSubstring: string) {
    const selectedUsers: User[] = [];

    this.users.some((user) => {
      const isEnd = selectedUsers.length >= limit;
      if (isEnd) return true;

      const isSubstring = user.login.startsWith(loginSubstring);
      if (isSubstring && !user.isDeleted) {
        selectedUsers.push(user);
      }
    });

    return selectedUsers;
  }

  findOne(
    selector: string,
    { selectorType }: { selectorType: 'id' | 'login' },
  ) {
    const selectedUser =
      this.users.find((user) => user[selectorType] === selector) ?? null;

    if (selectedUser?.isDeleted) return null;

    return selectedUser;
  }

  createOne(createUserDto: CreateUserDto) {
    const newUser: User = {
      id: randomUUID(),
      isDeleted: false,
      ...createUserDto,
    };
    this.users.push(newUser);

    return newUser;
  }

  updateOne(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.findOne(id, { selectorType: 'id' });

    if (updatedUser === null) return null;

    for (const key of Object.keys(updateUserDto)) {
      updatedUser[key] = updateUserDto[key];
    }

    return updatedUser;
  }

  deleteOne(id: string) {
    const deletedUser = this.findOne(id, { selectorType: 'id' });

    if (deletedUser === null) return null;

    deletedUser.isDeleted = true;

    return deletedUser;
  }
}
