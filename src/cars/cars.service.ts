import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
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
import { Cron } from '@nestjs/schedule';
import { UtilsService } from 'src/utils/utils.service';

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
    @InjectEntityManager()
    private entityManager: EntityManager,
    private utilsService: UtilsService,
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
      relations: { host: true },
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
      query.andWhere('engineSize.name = :engineSize', {
        engineSize: `${filter.engineSize}`,
      });
    }

    if (filter.carType) {
      query.andWhere('carType.name = :carType', {
        carType: `${filter.carType}`,
      });
    }

    if (filter.fuelType) {
      query.andWhere('fuelType.name = :fuelType', {
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

    if (filter.startDate && filter.endDate) {
      filteredCars = filteredCars.filter((car) => {
        let result = true;
        car.bookings.forEach((booking) => {
          const correctedBookingStartDate = this.utilsService.makeKrDate(
            booking.startDate,
          );
          const correctedBookingEndDate = this.utilsService.makeKrDate(
            booking.endDate,
          );
          const filterStartDate = new Date(filter.startDate);
          const filterEndDate = new Date(filter.endDate);

          result =
            result &&
            (correctedBookingEndDate < filterStartDate ||
              correctedBookingStartDate > filterEndDate);
          return result;
        });
        return result;
      });
    }

    filteredCars.forEach((car) => {
      car.startDate = this.utilsService.makeKrDate(car.startDate);
      car.endDate = this.utilsService.makeKrDate(car.endDate);
    });

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

    hostCar.startDate = this.utilsService.makeKrDate(hostCar.startDate);
    hostCar.endDate = this.utilsService.makeKrDate(hostCar.endDate);
    hostCar.bookings.forEach((booking) => {
      booking.startDate = this.utilsService.makeKrDate(booking.startDate);
      booking.endDate = this.utilsService.makeKrDate(booking.endDate);
    });

    return hostCar;
  }

  @Cron('0 0 * * *')
  async updateCarStatus(): Promise<void> {
    const allCars = await this.hostCarRepository.find();
    const now = new Date();
    allCars.forEach((car) => {
      const carEndDate = this.utilsService.makeKrDate(car.endDate);
      if (now > carEndDate) {
        this.hostCarRepository.update({ id: car.id }, { status: false });
      }
    });
    return;
  }
}
