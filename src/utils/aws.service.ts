import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService {
  constructor(readonly config: ConfigService) {
    AWS.config.update({
      region: this.config.get('REGION'),
      accessKeyId: this.config.get('ACCESSKEY'),
      secretAccessKey: this.config.get('SECRET_ACCESSKEY'),
    });
  }
  async generateSignedUrl(): Promise<{ signedUrl: any }> {
    const s3 = new AWS.S3();

    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: this.config.get('BUCKET'),
        Key: `${Date.now()}_${uuid()}`,
        Expires: 3600,
        ACL: 'public-read-write',
      };

      s3.getSignedUrl('putObject', s3Params, (err, url) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ signedUrl: url });
      });
    });
  }
}
