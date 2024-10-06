import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'The password of the user. Must contain at least 1 letter, 1 number, and 1 special character.',
  })
  @IsNotEmpty()
  password: string;
}
