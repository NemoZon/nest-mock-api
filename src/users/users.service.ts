import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private UserRepository: typeof User) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.UserRepository.create(createUserDto);
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
    const [affected, [updatedUser]] = await this.UserRepository.update(
      updateUserDto,
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
