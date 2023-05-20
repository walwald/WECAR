import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand, CarModel, CarType, EngineSize } from './entities';
import { NewModelDto } from './entities/dto/new-model.dto';

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
}
