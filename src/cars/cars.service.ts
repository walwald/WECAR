import {
  BadRequestException,
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
import { Booking } from 'src/bookings/entities';

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

  async getHostCars(filter: CarFilterDto): Promise<HostCar[]> {
    const limitNumber = 12;
    const skip = filter.page ? (filter.page - 1) * limitNumber : 0;

    if (!filter.startDate !== !filter.endDate)
      throw new BadRequestException('One of Start date or End date is Missnig');
    //조건에 맞는 booking들만 select 되어서 조건에 맞는 하나 이상의 booking이 있는 경우 결과에 나타남
    //문제: 하나라도 해당하는 booking이 있으면 값이 나와버림
    const query = this.hostCarRepository
      .createQueryBuilder('hostCar')
      .leftJoinAndSelect('hostCar.carModel', 'carModel')
      .leftJoinAndSelect('hostCar.fuelType', 'fuelType')
      .leftJoinAndSelect('hostCar.options', 'option')
      .leftJoinAndSelect('hostCar.bookings', 'booking')
      .leftJoinAndSelect('hostCar.files', 'file')
      .leftJoinAndSelect('carModel.brand', 'brand')
      .leftJoinAndSelect('carModel.engineSize', 'engineSize')
      .leftJoinAndSelect('carModel.carType', 'carType')
      .where('hostCar.status = true')
      .take(limitNumber)
      .skip(skip)
      .select([
        'hostCar.id',
        'hostCar.pricePerDay',
        'hostCar.address',
        'hostCar.startDate',
        'hostCar.endDate',
        'carModel.name',
        'brand.name',
        'file.url',
        'booking',
      ]);

    if (filter.address) {
      query.andWhere('hostCar.address LIKE :address', {
        address: `%${filter.address}%`,
      });
    }
    //bookings는 전부 꺼내서 처리하기
    if (filter.startDate && filter.endDate) {
      query
        .andWhere(
          'DATE_FORMAT(hostCar.startDate, "%Y-%m-%d") <= :startDate AND DATE_FORMAT(hostCar.endDate, "%Y-%m-%d") >= :startDate',
          { startDate: `${filter.startDate}` },
        )
        .andWhere(
          'DATE_FORMAT(hostCar.endDate, "%Y-%m-%d") >= :endDate AND DATE_FORMAT(hostCar.startDate, "%Y-%m-%d") <= :endDate',
          { endDate: `${filter.endDate}` },
        );
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

    let filteredCars = await query.getMany();

    //filter ver. 로직에는 문제 없는 듯 근데 날짜가 문제?
    // .andWhere(
    //   '(DATE_FORMAT(booking.endDate, "%Y-%m-%d") < :startDate OR DATE_FORMAT(booking.startDate, "%Y-%m-%d") > :endDate)',
    //   { startDate: `${filter.startDate}`, endDate: `${filter.endDate}` },
    // )
    // .orWhere('booking.id IS NULL');

    //car.bookings에 대해 for Each 돌리기 true만 있어야...근데 length가 0이면?
    if (filter.startDate && filter.endDate) {
      filteredCars = filteredCars.filter((car, index) => {
        let result = true;
        car.bookings.forEach((booking, indexing) => {
          console.log(result, indexing);
          const bookingStartDate = new Date(booking.startDate);
          const bookingEndDate = new Date(booking.endDate);
          const filterStartDate = new Date(filter.startDate);
          const filterEndDate = new Date(filter.endDate);
          console.log(
            '변수들: ',
            bookingStartDate,
            bookingEndDate,
            filterStartDate,
            filterEndDate,
          );
          console.log(
            '원본들: ',
            booking.startDate,
            booking.endDate,
            filter.startDate,
            filter.endDate,
          );
          result =
            result &&
            (bookingEndDate < filterStartDate ||
              bookingStartDate > filterEndDate);
          return result;
        });
        console.log(result, index);
        return result;
      });
    }
    return Promise.all(filteredCars);
  }

  async getHostCarDetail(id: number): Promise<HostCar> {
    const hostCar = await this.hostCarRepository
      .createQueryBuilder('hostCar')
      .leftJoinAndSelect('hostCar.host', 'host')
      .leftJoinAndSelect('hostCar.carModel', 'carModel')
      .leftJoinAndSelect('hostCar.fuelType', 'fuelType')
      .leftJoinAndSelect('hostCar.options', 'option')
      .leftJoinAndSelect('hostCar.files', 'file')
      .leftJoinAndSelect('carModel.brand', 'brand')
      .leftJoinAndSelect('carModel.engineSize', 'engineSize')
      .leftJoinAndSelect('carModel.carType', 'carType')
      .leftJoinAndSelect('hostCar.bookings', 'booking')
      .select([
        'hostCar',
        'carModel',
        'brand',
        'engineSize',
        'carType',
        'fuelType',
        'option',
        'file',
        'booking',
        'host.name',
      ])
      .where('hostCar.id = :id', { id })
      .getOne();

    if (!hostCar) throw new NotFoundException('Invalid hostCar Id');

    return hostCar;
  }
}
