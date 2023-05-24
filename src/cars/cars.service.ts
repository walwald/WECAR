import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import {
  Brand,
  CarModel,
  CarType,
  EngineSize,
  FuelType,
  HostCar,
} from './entities';
import { HostsService } from 'src/hosts/hosts.service';
import { File } from 'src/utils/entities/file.entity';
import { CarFilterDto, FileDto, NewHostCarDto, NewModelDto } from './dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarModel)
    private carModelsRepository: Repository<CarModel>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(EngineSize)
    private engineSizeRepository: Repository<EngineSize>,
    @InjectRepository(CarType)
    private carTypeRepository: Repository<CarType>,
    @InjectRepository(HostCar)
    private hostCarRepository: Repository<HostCar>,
    @InjectRepository(FuelType)
    private fuelTypeRepository: Repository<FuelType>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private hostsService: HostsService,
  ) {}

  registerNewModel(newModels: NewModelDto[]): Promise<CarModel[]> {
    const createdModels = newModels.map(async (newModel) => {
      const isExisting = await this.carModelsRepository.findOne({
        where: { name: newModel.name },
        relations: ['brand', 'engineSize', 'carType'],
      });
      if (isExisting) {
        return isExisting;
      }
      const brand = await this.brandRepository.findOneBy({
        name: newModel.brand,
      });
      const engineSize = await this.engineSizeRepository.findOneBy({
        size: newModel.engineSize,
      });
      const carType = await this.carTypeRepository.findOneBy({
        type: newModel.carType,
      });

      const createdModel = this.carModelsRepository.create({
        name: newModel.name,
        capacity: newModel.capacity,
      });

      createdModel.brand = brand;
      createdModel.engineSize = engineSize;
      createdModel.carType = carType;

      this.carModelsRepository.save(createdModel);

      return createdModel;
    });

    return Promise.all(createdModels);
  }

  getBrandList(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async getModelsByBrand(id: number) {
    const selectedBrand = await this.brandRepository.findOne({
      where: { id },
      relations: ['carModels'],
    });

    if (!selectedBrand) throw new NotFoundException('Invalid Brand Id');

    return selectedBrand.carModels;
  }

  async getModelInfo(id: number): Promise<CarModel> {
    const selectedModel = await this.carModelsRepository.findOne({
      where: { id },
      relations: ['brand', 'engineSize', 'carType'],
    });

    if (!selectedModel) throw new NotFoundException('Invalid Car Model Id');

    return selectedModel;
  }

  getAllModels(): Promise<CarModel[]> {
    return this.carModelsRepository.find({
      relations: ['brand', 'engineSize', 'carType'],
    });
  }

  async registerNewHostCar(
    newHostCar: NewHostCarDto,
    files: FileDto[],
    hostId: number,
  ): Promise<HostCar> {
    const isExisting = await this.hostCarRepository.findOne({
      where: [{ carNumber: newHostCar.carNumber }, { host: { id: hostId } }],
      relations: ['host'],
    });

    if (isExisting) {
      throw new NotAcceptableException('Duplicate Car Number or Host');
    }

    const carModel = await this.carModelsRepository.findOneBy({
      name: newHostCar.carModel,
    });

    const fuelType = await this.fuelTypeRepository.findOneBy({
      type: newHostCar.fuelType,
    });

    if (!carModel || !fuelType) {
      throw new NotFoundException('Invalid Car Model or Fuel Type');
    }

    const newCar = this.hostCarRepository.create({
      ...newHostCar,
      fuelType,
      carModel,
      host: { id: hostId },
    });

    const createdFiles = files.map((file) =>
      this.fileRepository.create({ ...file, hostCar: newCar }),
    );

    newCar.files = createdFiles;

    await this.fileRepository.save(createdFiles);
    await this.hostCarRepository.save(newCar);

    return newCar;
  }

  deleteHostCar(hostId: number): Promise<DeleteResult> {
    return this.hostCarRepository.delete({ host: { id: hostId } });
  }

  async getCarByHost(hostId: number): Promise<HostCar> {
    return this.hostCarRepository.findOne({
      relations: [
        'carModel',
        'carModel.brand',
        'carModel.carType',
        'carModel.engineSize',
        'fuelType',
        'files',
      ],
      where: { host: { id: hostId } },
    });
  }

  getHostCars(filter: CarFilterDto): Promise<HostCar[]> {
    const query = this.hostCarRepository
      .createQueryBuilder('hostCar')
      .leftJoinAndSelect('hostCar.carModel', 'carModel')
      .leftJoinAndSelect('hostCar.fuelType', 'fuelType')
      .leftJoinAndSelect('carModel.brand', 'brand')
      .leftJoinAndSelect('carModel.engineSize', 'engineSize')
      .leftJoinAndSelect('carModel.carType', 'carType');

    if (filter.address) {
      query.andWhere('hostCar.address LIKE :address', {
        address: `${filter.address}`,
      });
    }

    if (filter.startDate) {
      query.andWhere('hostCar.startDate <= :startDate', {
        startDate: `${filter.startDate}`,
      });
    }

    if (filter.endDate) {
      query.andWhere('hostCar.endDate >= :endDate', {
        endDate: `${filter.endDate}`,
      });
    }

    if (filter.minCapacity) {
      query.andWhere('carModel.capacity >= :minCapa', {
        minCapa: `${filter.minCapacity}`,
      });
    }

    if (filter.brand) {
      query.andWhere('carModel.brand.name = :brand', {
        brand: `${filter.brand}`,
      });
    }

    if (filter.engineSize) {
      query.andWhere('carModel.engineSize.size = :engineSize', {
        EngineSize: `${filter.engineSize}`,
      });
    }

    if (filter.carType) {
      query.andWhere('carModel.carType.type = :carType', {
        carType: `${filter.carType}`,
      });
    }

    if (filter.fuelType) {
      query.andWhere('fuelType.type = :fuelType', {
        fuelType: `${filter.fuelType}`,
      });
    }

    if (filter.minPrice) {
      query.andWhere('hostCar.pricePerDay >= :minPrice', {
        minPrice: `${filter.minPrice}`,
      });
    }

    if (filter.maxPrice) {
      query.andWhere('hostCar.pricePerDay <= :maxPrice', {
        maxPrice: `${filter.maxPrice}`,
      });
    }

    if (filter.capacity) {
      query.andWhere('carModel.capacity = :capacity', {
        capacity: `${filter.capacity}`,
      });
    }

    if (filter.options) {
      // console.log('**********filter.options:', filter.options);
      // console.log('**********type of filter.Options:', typeof filter.options);
      // query.andWhere(':option IN hostCar.options', {
      //   option: `${filter.options}`,
      // });
      query.where(`FIND_IN_SET(:option, hostCar.options) > 0`, {
        option: filter.options,
      });
      // filter.options.map(()=>.andWhere('hostCar.optoins IN :'))
      // const joinedOptions = filter.options.join('%');
      // console.log('**********joinedOptions:', joinedOptions);

      // const parsedOptions = JSON.parse(filter.options);
      // console.log('**********parsedOptions:', parsedOptions);
      // console.log('**********type of parsedOptions:', typeof parsedOptions);
      // const optionsArr = filter.options.split("',");
      // const optionsArr = filter.options.split("','");
      // query.andWhere(`ARRAY[?] <@ hostCar.options`).setParameters(optionsArr);
      // query.andWhere(':options IN hostCar.options', {
      //   options: `${filter.options}`,
      // });
    }
    //배열 변환 문제
    // const cars = await carRepository
    //   .createQueryBuilder('car')
    //   .where(`ARRAY[${subset.map(() => '?').join(',')}] <@ car.options`)
    //   .setParameters(subset)
    //   .getMany();

    return query.getMany();
  }
}
