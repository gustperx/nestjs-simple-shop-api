import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators';
import { Brand } from './entities/brand.entity';

import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Brand was created',
    type: Brand,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @Auth(ValidRoles.admin)
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Brand List OK', type: [Brand] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.brandsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiParam({ name: 'term', example: 'ID or Name' })
  @ApiResponse({ status: 200, description: 'Brand OK', type: Brand })
  @ApiResponse({ status: 404, description: 'Not found. Brand not found' })
  findOne(@Param('term') term: string) {
    return this.brandsService.findOne(term);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Brand was updated',
    type: Brand,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not found. Brand not found' })
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Brand was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not found. Brand not found' })
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.remove(id);
  }
}
