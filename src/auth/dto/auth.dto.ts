import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export type Role = 'USER' | 'ADMIN';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/symbol'
  })
  @Transform(({ value }) => value?.trim())
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  confirmPassword: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN'])
  role?: Role;
}


export class CreateUserDto extends RegisterDto {
 
}

// Login DTO
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}