import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Unique email' })
  readonly email: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'User password' })
  readonly password: string;

  @ApiProperty({
    example: 'Alice',
    required: false,
    description: 'Display name',
  })
  readonly name: string;

  @ApiProperty({ example: 25, required: false, description: 'Age in years' })
  readonly age: number;
}
