import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'hello@example.com',
    description: 'User email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'My Name',
    description: 'User name',
    required: false,
  })
  @IsString()
  @MinLength(1)
  readonly fullName: string;

  @ApiProperty({
    example: 'Secret123',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
