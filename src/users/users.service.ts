import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private UserRepository: typeof User) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.UserRepository.create(createUserDto);
    return user;
  }

  async findAll() {
    const users = await this.UserRepository.findAll();
    return users;
  }

  async findOne(id: number) {
    const users = await this.UserRepository.findByPk(id);
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const [affected, [updatedUser]] = await this.UserRepository.update(
      updateUserDto,
      { where: { id }, returning: true },
    );

    if (!affected) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: number) {
    const deleted = await this.UserRepository.destroy({ where: { id } });

    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return { deleted: true };
  }
}
