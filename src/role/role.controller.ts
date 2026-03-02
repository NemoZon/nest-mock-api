import {
  UseGuards,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Create role' })
  @ApiCreatedResponse({ type: Role, description: 'Role created' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ type: [Role] })
  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }

  @ApiOperation({ summary: 'Get role by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Role })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roleService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update role by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Role })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete role by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(+id);
  }
}
