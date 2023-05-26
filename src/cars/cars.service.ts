import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import {
  Brand,
  CarModel,
  CarType,
  EngineSize,
  FuelType,
  HostCar,
  Option,
} from './entities';
import { File } from 'src/utils/entities/file.entity';
import { CarFilterDto, FileDto, NewHostCarDto, NewModelDto } from './dto';
import { ValidationInfo } from './types/validation.interface';

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
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    private entityManager: EntityManager,
  ) {}

  registerNewModel(newModels: NewModelDto[]): Promise<CarModel[]> {
    const createdModels = newModels.map(async (newModel) => {
      const isExisting = await this.carModelsRepository.findOne({
        where: { name: newModel.name },
        relations: { brand: true, engineSize: true, carType: true },
      });
      if (isExisting) {
        return isExisting;
      }

      const { brand, engineSize, carType } = await this.validateModelInfo(
        newModel.brand,
        newModel.engineSize,
        newModel.carType,
      );

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

  async validateModelInfo(
    brandName: string,
    engineSizeName: string,
    carTypeName: string,
  ): Promise<ValidationInfo> {
    const brand = await this.brandRepository.findOneBy({
      name: brandName,
    });
    const engineSize = await this.engineSizeRepository.findOneBy({
      name: engineSizeName,
    });
    const carType = await this.carTypeRepository.findOneBy({
      name: carTypeName,
    });

    if (!brand || !engineSize || !carType) {
      throw new NotFoundException('Invalid Brand, Car Type, or Engine Size');
    }
    return { brand, engineSize, carType };
  }

  getBrandList(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async getModelsByBrand(id: number) {
    const selectedBrand = await this.brandRepository.findOne({
      where: { id },
      relations: { carModels: true },
    });

    if (!selectedBrand) throw new NotFoundException('Invalid Brand Id');

    return selectedBrand.carModels;
  }

  async getModelInfo(id: number): Promise<CarModel> {
    const selectedModel = await this.carModelsRepository.findOne({
      where: { id },
      relations: { brand: true, engineSize: true, carType: true },
    });

    if (!selectedModel) throw new NotFoundException('Invalid Car Model Id');

    return selectedModel;
  }

  getAllModels(): Promise<CarModel[]> {
    return this.carModelsRepository.find({
      relations: { brand: true, engineSize: true, carType: true },
    });
  }

  async createOption(options: string[]): Promise<Option[]> {
    const optionList = options.map((option) => {
      const createdOption = this.optionRepository.create({ name: `${option}` });
      this.optionRepository.save(createdOption);
      return createdOption;
    });

    return Promise.all(optionList);
  }

  async validateHostCarInfo(
    modelName: string,
    fuelName: string,
    optionArr: string[],
  ): Promise<ValidationInfo> {
    const carModel = await this.carModelsRepository.findOneBy({
      name: `${modelName}`,
    });

    const fuelType = await this.fuelTypeRepository.findOneBy({
      name: `${fuelName}`,
    });

    const options = await Promise.all(
      optionArr.map(async (option) => {
        const data = this.optionRepository.findOneBy({ name: option });
        if (!data) throw new NotFoundException('Invalid Car Option');
        return data;
      }),
    );

    if (!carModel || !fuelType) {
      throw new NotFoundException('Invalid Car Model or Fuel Type');
    }

    return { carModel, fuelType, options };
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

    const { carModel, fuelType, options } = await this.validateHostCarInfo(
      newHostCar.carModel,
      newHostCar.fuelType,
      newHostCar.options,
    );

    const newCar = this.hostCarRepository.create({
      ...newHostCar,
      options,
      fuelType,
      carModel,
      host: { id: hostId },
    });

    newCar.options = options;

    const createdFiles = files.map((file) =>
      this.fileRepository.create({ ...file, hostCar: newCar }),
    );

    newCar.files = createdFiles;

    await this.entityManager.transaction(async (entityManager) => {
      await entityManager.save(createdFiles);
      await entityManager.save(newCar);
    });
    return newCar;
  }

  deleteHostCar(hostId: number): Promise<DeleteResult> {
    return this.hostCarRepository.delete({ host: { id: hostId } });
  }

  async getCarByHost(hostId: number): Promise<HostCar> {
    return this.hostCarRepository.findOne({
      relations: {
        carModel: { brand: true, carType: true, engineSize: true },
        fuelType: true,
        files: true,
        options: true,
      },
      where: { host: { id: hostId } },
    });
  }

  getHostCars(filter: CarFilterDto): Promise<HostCar[]> {
    const limitNumber = 12;
    const skip = filter.page ? (filter.page - 1) * limitNumber : 0;

    const query = this.hostCarRepository
      .createQueryBuilder('hostCar')
      .leftJoinAndSelect('hostCar.carModel', 'carModel')
      .leftJoinAndSelect('hostCar.fuelType', 'fuelType')
      .leftJoinAndSelect('hostCar.options', 'option')
      .leftJoinAndSelect('hostCar.files', 'file')
      .leftJoin('hostCar.bookings', 'booking')
      .leftJoinAndSelect('carModel.brand', 'brand')
      .leftJoinAndSelect('carModel.engineSize', 'engineSize')
      .leftJoinAndSelect('carModel.carType', 'carType')
      .where('hostCar.status = true')
      .offset(skip)
      .limit(limitNumber)
      .select([
        'hostCar.id',
        'hostCar.pricePerDay',
        'hostCar.address',
        'hostCar.startDate',
        'hostCar.endDate',
        'carModel.name',
        'brand.name',
        'file.url',
      ]);

    if (filter.address) {
      query.andWhere('hostCar.address LIKE :address', {
        address: `${filter.address}`,
      });
    }

    if (filter.startDate) {
      query.andWhere('hostCar.startDate <= :startDate', {
        startDate: `${filter.startDate}`,
      });
      // .andWhere('(booking.id IS NULL) OR (booking.endDate < :startDate)', {
      //   startDate: `${filter.startDate}`,
      // });
    }
    //문제: 하나라도 해당하는 booking이 있으면 값이 나와버림

    if (filter.endDate) {
      query.andWhere('hostCar.endDate >= :endDate', {
        endDate: `${filter.endDate}`,
      });
      // .andWhere('(booking.id IS NULL) OR (booking.startDate > :endDate)', {
      //   endDate: `${filter.endDate}`,
      // });
    }

    if (filter.minCapacity) {
      query.andWhere('carModel.capacity >= :minCapa', {
        minCapa: `${filter.minCapacity}`,
      });
    }

    if (filter.brand) {
      query.andWhere('brand.name = :brand', {
        brand: `${filter.brand}`,
      });
    }

    if (filter.engineSize) {
      query.andWhere('engineSize.size = :engineSize', {
        EngineSize: `${filter.engineSize}`,
      });
    }

    if (filter.carType) {
      query.andWhere('carType.type = :carType', {
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

    if (filter.options?.length > 0) {
      query.andWhere('option.name IN (:options)', { options: filter.options });
    }

    return query.getMany();
  }

  async getHostCarDetail(id: number): Promise<HostCar> {
    const hostCar = await this.hostCarRepository.findOne({
      relations: {
        carModel: { brand: true, carType: true, engineSize: true },
        fuelType: true,
        files: true,
        options: true,
        bookings: true,
      },
      where: { id },
    });

    if (!hostCar) throw new NotFoundException('Invalid hostCar Id');

    return hostCar;
  }
}
