import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Brand, CarModel, HostCar } from './entities';
import { NewModelDto } from './dto/new-model.dto';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/types';
import { AuthGuard } from '@nestjs/passport';
import { NewHostCarDto } from './dto/new-host-car.dto';
import { FileDto } from './dto/file.dto';
import { DeleteResult } from 'typeorm';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('brands')
  getBrandList(): Promise<Brand[]> {
    return this.carsService.getBrandList();
  }

  @Get('brands/:id')
  getModelsByBrand(@Param('id') id: number): Promise<CarModel[]> {
    return this.carsService.getModelsByBrand(id);
  }

  @Post('models/register')
  registerNewModel(@Body() newModels: NewModelDto[]): Promise<CarModel[]> {
    return this.carsService.registerNewModel(newModels);
  }

  @Get('models')
  getAllModels(): Promise<CarModel[]> {
    return this.carsService.getAllModels();
  }

  @Get('models/:id')
  getModelInfo(@Param('id') id: number): Promise<CarModel> {
    return this.carsService.getModelInfo(id);
  }

  @Post('host')
  @UseGuards(AuthGuard('jwt-host'))
  registerNewHostCar(
    @Body() requestBody: { newHostCar: NewHostCarDto; files: FileDto[] },
    @User() host: ReqUser,
  ): Promise<HostCar> {
    const { newHostCar, files } = requestBody;
    return this.carsService.registerNewHostCar(newHostCar, files, host.id);
  }

  @Delete('host')
  @UseGuards(AuthGuard('jwt-host'))
  deleteHostCar(@User() host: ReqUser): Promise<DeleteResult> {
    return this.carsService.deleteHostCar(host.id);
  }
}
