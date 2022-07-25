import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  BadRequestException,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findMany(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('loginSubstring', new DefaultValuePipe(''))
    loginSubstring: string,
  ) {
    const users = this.usersService.findMany(limit, loginSubstring);

    return users;
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.usersService.findOne(id, { selectorType: 'id' });

    if (user === null) throw new NotFoundException();

    return user;
  }

  @Post()
  createOne(
    @Body(CustomValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    this.validateLogin(createUserDto.login, undefined, {
      passUnchangedLogin: false,
    });

    const newUser = this.usersService.createOne(createUserDto);
    return newUser;
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(CustomValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    this.validateLogin(updateUserDto.login, id, { passUnchangedLogin: true });

    const updatedUser = this.usersService.updateOne(id, updateUserDto);

    if (updatedUser === null) throw new NotFoundException();

    return updatedUser;
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    const deletedUser = this.usersService.deleteOne(id);

    if (deletedUser === null) throw new NotFoundException();

    return deletedUser;
  }

  private validateLogin(
    newLogin: string,
    currentId = '',
    { passUnchangedLogin }: { passUnchangedLogin: boolean },
  ) {
    const userByLogin = this.usersService.findOne(newLogin, {
      selectorType: 'login',
    });

    if (userByLogin === null) return;

    const isLoginStayedSame = userByLogin?.id === currentId;
    if (passUnchangedLogin && isLoginStayedSame) return;

    throw new BadRequestException('The suggested login is already in use');
  }
}
