import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Unique title',
  })
  readonly title: string;

  @ApiProperty({
    example: 'This is ADMIN role ...',
    description: 'Role description',
  })
  readonly description?: string;
}
