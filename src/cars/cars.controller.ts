import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Brand, CarModel, HostCar, Option } from './entities';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/types';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { CarFilterDto, CarRegisterDto, NewModelDto } from './dto';
import { FilteredList } from './types/filtered-list.interface';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  //custon origin - header > bot 접근 막음
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

  @Post('options')
  createOption(@Body() options: string[]): Promise<Option[]> {
    return this.carsService.createOption(options);
  }

  @Post('host')
  @UseGuards(AuthGuard('jwt-host'))
  registerNewHostCar(
    @Body()
    { newHostCar, files }: CarRegisterDto,
    @User() { id: hostId }: ReqUser,
  ): Promise<HostCar> {
    return this.carsService.registerNewHostCar(newHostCar, files, hostId);
  }

  @Delete('host')
  @UseGuards(AuthGuard('jwt-host'))
  deleteHostCar(@User() host: ReqUser): Promise<DeleteResult> {
    return this.carsService.deleteHostCar(host.id);
  }

  @Get('host')
  @UseGuards(AuthGuard('jwt-host'))
  getCarByHost(@User() host: ReqUser): Promise<HostCar> {
    return this.carsService.getCarByHost(host.id);
  }

  @Get()
  getHostCars(@Query() filter: CarFilterDto): Promise<FilteredList> {
    return this.carsService.getHostCars(filter);
  }

  @Get(':id')
  getHostCarDetail(@Param('id') id: number): Promise<HostCar> {
    return this.carsService.getHostCarDetail(id);
  }
}
