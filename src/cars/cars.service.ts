import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOperator, Repository } from 'typeorm';
import {
  Brand,
  CarModel,
  CarType,
  EngineSize,
  FuelType,
  HostCar,
} from './entities';
import { NewModelDto } from './dto/new-model.dto';
import { HostsService } from 'src/hosts/hosts.service';
import { NewHostCarDto } from './dto/new-host-car.dto';
import { File } from 'src/utils/entities/file.entity';
import { FileDto } from './dto/file.dto';

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
    const host = await this.hostsService.findOneById(hostId);
    const isExisting = await this.hostCarRepository.findOne({
      where: [{ carNumber: newHostCar.carNumber }, { host: { id: hostId } }],
      relations: ['host'],
    });

    if (isExisting) {
      throw new NotAcceptableException('Duplicate Car Number of Host');
    }

    const carModel = await this.carModelsRepository.findOneBy({
      name: newHostCar.carModel,
    });
    const fuelType = await this.fuelTypeRepository.findOneBy({
      type: newHostCar.fuelType,
    });

    const newCar = this.hostCarRepository.create({
      ...newHostCar,
      fuelType,
      carModel,
      host,
    });

    const createdFiles = files.map((file) =>
      this.fileRepository.create({ ...file, hostCar: newCar }),
    );

    newCar.files = createdFiles;
    // createdFiles.map((file) => (file.hostCar = newCar));
    await this.fileRepository.save(createdFiles);
    await this.hostCarRepository.save(newCar);
    return newCar;
  }

  deleteHostCar(hostId: number): Promise<DeleteResult> {
    return this.hostCarRepository.delete({ host: { id: hostId } });
  }
}
