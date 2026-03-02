import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/role/entities/role.entity';
import { hashPassword } from '../common/password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private UserRepository: typeof User,
    @InjectModel(Role) private readonly RoleRepository: typeof Role,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role: Role | null = await this.RoleRepository.findByPk(
      createUserDto.roleId,
    );
    if (!role) {
      throw new NotFoundException(
        `Role with id ${createUserDto.roleId} not found`,
      );
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    return await this.UserRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  findAll(): Promise<User[]> {
    return this.UserRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.UserRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.roleId !== undefined) {
      const role: Role | null = await this.RoleRepository.findByPk(
        updateUserDto.roleId,
      );
      if (!role) {
        throw new NotFoundException(
          `Role with id ${updateUserDto.roleId} not found`,
        );
      }
    }

    const updatePayload = { ...updateUserDto };
    if (updateUserDto.password) {
      updatePayload.password = await hashPassword(updateUserDto.password);
    }

    const [affected, [updatedUser]] = await this.UserRepository.update(
      updatePayload,
      { where: { id }, returning: true },
    );

    if (!affected) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const deleted = await this.UserRepository.destroy({ where: { id } });

    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return { deleted: true };
  }
}
