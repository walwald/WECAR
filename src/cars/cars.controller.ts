import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Brand, CarModel, HostCar } from './entities';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/types';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { CarFilterDto, FileDto, NewHostCarDto, NewModelDto } from './dto';

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

  //전체 dto 하나 추가
  //받아오는 과정에서 구조분해 할당으로 받아올 수 있음, 인자 세 개 다
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

  @Get('host')
  @UseGuards(AuthGuard('jwt-host'))
  getCarByHost(@User() host: ReqUser): Promise<HostCar> {
    return this.carsService.getCarByHost(host.id);
  }

  @Get()
  getHostCars(@Query() filter: CarFilterDto): Promise<HostCar[]> {
    return this.carsService.getHostCars(filter);
  }
}
