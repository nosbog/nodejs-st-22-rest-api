import { Min, Max, IsString, Matches, MinLength, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @Matches(/\d+/, { message: '$property must contain a number' })
  @Matches(/[a-zA-Z]/, { message: '$property must contain a letter' })
  password: string;

  @IsInt()
  @Min(4)
  @Max(130)
  age: number;
}
