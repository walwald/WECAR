import { UnauthorizedException } from '@nestjs/common';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UtilsService } from 'src/utils/utils.service';

export class BaseUser {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'password_salt' })
  passwordSalt: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'phone_number', unique: true, nullable: false })
  phoneNumber: string;

  @Column({ name: 'marketing_agreement' })
  marketingAgreement: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  updatePassword(password: string): void {
    this.passwordSalt = UtilsService.createSalt();
    this.password = UtilsService.hashPassword(password, this.passwordSalt);
  }

  async checkPassword(password: string): Promise<void> {
    if (
      this.password !== UtilsService.hashPassword(password, this.passwordSalt)
    ) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    return;
  }
}
