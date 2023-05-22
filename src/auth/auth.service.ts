import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Host } from 'src/hosts/entities/host.entity';
import { UtilsService } from 'src/utils/utils.service';
import { Payload } from './dto';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
    private readonly utilsService: UtilsService,
  ) {}

  async tokenValidateUser(payload: Payload): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: payload.id, name: payload.name },
    });
  }

  async tokenValidateHost(payload: Payload): Promise<Host | null> {
    return this.hostRepository.findOne({
      where: { id: payload.id, name: payload.name },
    });
  }
}
