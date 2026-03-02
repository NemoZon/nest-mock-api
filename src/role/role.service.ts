import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private UserRepository: typeof Role) {}

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.UserRepository.create(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    return this.UserRepository.findAll();
  }

  async findOne(id: number): Promise<Role> {
    const result = await this.UserRepository.findByPk(id);
    if (!result) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return result;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const [affected, [updatedRole]] = await this.UserRepository.update(
      updateRoleDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (!affected) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return updatedRole;
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const deleted = await this.UserRepository.destroy({ where: { id } });

    if (!deleted) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return { deleted: true };
  }
}
