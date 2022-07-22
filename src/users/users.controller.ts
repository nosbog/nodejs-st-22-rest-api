import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  Query,
  Body,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findMany(
    @Query('limit', new DefaultValuePipe(100)) limit: number,
    @Query('loginSubstring', new DefaultValuePipe('')) loginSubstring: string,
  ) {
    const users = this.usersService.findMany(limit, loginSubstring);

    return users;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);

    if (user === null) throw new NotFoundException();

    return user;
  }

  @Post()
  createOne(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    const newUser = this.usersService.createOne(createUserDto);

    return newUser;
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = this.usersService.updateOne(id, updateUserDto);

    if (updatedUser === null) throw new NotFoundException();

    return updatedUser;
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    const deletedUser = this.usersService.deleteOne(id);

    if (deletedUser === null) throw new NotFoundException();

    return deletedUser;
  }
}
