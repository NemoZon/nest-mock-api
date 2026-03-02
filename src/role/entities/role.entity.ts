import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface RoleCreationAttrs {
  title: string;
  description?: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Unique id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'ADMIN', description: 'Role title' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare title: string;

  @ApiProperty({
    example: 'Has all permissions',
    description: 'Role description',
  })
  @Column({
    type: DataType.STRING,
  })
  declare description: string;
}
