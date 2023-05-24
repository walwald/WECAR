import { Controller, Get } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('utils')
export class UtilsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('aws/signedurl')
  getSignedUrl(): Promise<{ signedUrl: string }> {
    return this.awsService.generateSignedUrl();
  }
}
//common, shared
//AWS 안에서도 분리될 수 있음
