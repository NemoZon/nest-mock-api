import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttrs {
  email: string;
  password: string;
  name?: string;
  age?: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Unique id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email (must be unique)',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Hashed or raw password depending on implementation',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @ApiProperty({
    example: 'Alice',
    required: false,
    description: 'Display name',
  })
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @ApiProperty({
    example: 27,
    required: false,
    description: 'Age in years',
  })
  @Column({
    type: DataType.INTEGER,
  })
  declare age: number;
}
