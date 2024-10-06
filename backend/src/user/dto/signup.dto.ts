import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain 1 letter, 1 number, and 1 special character',
  })
  @ApiProperty({
    example: 'P@ssw0rd',
    description:
      'Password must be at least 8 characters long, contain 1 letter, 1 number, and 1 special character',
  })
  password: string;
}
