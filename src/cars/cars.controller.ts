import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Brand, CarModel } from './entities';
import { NewModelDto } from './entities/dto/new-model.dto';

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
}
