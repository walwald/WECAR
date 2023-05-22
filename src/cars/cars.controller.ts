import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Brand, CarModel, HostCar } from './entities';
import { NewModelDto } from './dto/new-model.dto';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
import { NewHostCarDto } from './dto/new-host-car.dto';

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

  @Post('register')
  @UseGuards(AuthGuard('jwt-host'))
  registerNewHostCar(
    @Body() newHostCar: NewHostCarDto,
    @User() host: ReqUser,
  ): Promise<HostCar> {
    return this.carsService.registerNewHostCar(newHostCar, host.id);
  }
}
